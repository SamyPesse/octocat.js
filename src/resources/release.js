const Promise = require('q');
const is = require('is');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const querystring = require('querystring');
const progress = require('progress-stream');

const Resource = require('./resource');
const ReleaseAsset = require('./release_asset');

/**
 * Model to represent a release.
 * @type {Resource}
 */
class Release extends Resource {
    constructor(client, repo, id) {
        super(client);
        this.repo = repo;
        this.id = id;
        this._infos = null;
    }

    /**
     * Return API endpoint for this asset.
     */
    url(...args) {
        return this.repo.url(`releases/${this.id}`, ...args);
    }

    asset(id) { return this.resource(ReleaseAsset, id); }

    // Get details about the release
    info() {
        const that = this;

        return this.get('')
            .get('body')
            .tap((infos) => {
                that._infos = infos;
            });
    }

    // Edit this release
    edit(params) {
        return this.patch('', params)
            .get('body');
    }

    /**
     * Upload an asset
     */
    upload(output, opts) {
        const that = this;
        let originalOutput;

        opts = {
            name: null,
            label: undefined,
            mime: null,
            size: null,
            ...opts
        };

        // Normalize to a stream
        if (is.string(output)) {
            originalOutput = output;
            opts.name = opts.name || path.basename(output);
            output = fs.createReadStream(output);
        } else {
            if (!opts.name || !opts.size) {
                throw new Error('Need \'name\' and \'size\' options when uploading a stream');
            }
        }

        // Detect mime type
        if (!opts.mime) {
            opts.mime = mime.lookup(opts.name) || 'application/octet-stream';
        }

        return Promise()

        // Detect size
        .then(() => {
            if (opts.size) {
                return opts.size;
            }

            return Promise.nfcall(fs.stat, originalOutput).get('size');
        })
        .then((size) => {
            opts.size = size;
            return that._infos || that.info();
        })
        .then((release) => {
            const d = Promise.defer();

            const uploadUrl = release.upload_url.replace(/\{(\S+)\}/, '') + '?' + querystring.stringify({
                name: opts.name,
                label: opts.label
            });

            const prg = progress({
                length: opts.size,
                time: 100
            });

            prg.on('progress', (state) => {
                d.notify(state);
            });

            output.on('error', (err) => {
                d.reject(err);
            });

            that.client.post(uploadUrl, undefined, {
                json: false,
                headers: {
                    'Content-Type': opts.mime,
                    'Content-Length': opts.size
                },
                process(r) {
                    output.pipe(prg).pipe(r);
                }
            })
            .then(() => {
                d.resolve();
            }, (err) => {
                d.reject(err);
            });

            return d.promise;
        });
    }

    // Remove the release
    destroy() {
        return this.del('/');
    }
}

module.exports = Release;
