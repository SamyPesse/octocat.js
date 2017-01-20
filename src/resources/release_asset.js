const is = require('is');
const Promise = require('q');
const fs = require('fs');
const Resource = require('./resource');

/**
 * Model to represent an asset in an release.
 * @type {Resource}
 */
class ReleaseAsset extends Resource {
    constructor(client, release, id) {
        super(client);
        this.release = release;
        this.id = id;
        this._infos = null;
    }

    /**
     * Return API endpoint for this asset.
     */
    url(...args) {
        return this.release.repo.url(`releases/assets/${this.id}`);
    }

    // Get details about this asset
    info() {
        return this.get('')
            .get('body');
    }

    /**
     * Download this asset into a file "output"
     * @param  {String|Stream} output
     * @return {Promise}
     */
    download(output) {
        const d = Promise.defer();

        // Normalize to a stream
        if (is.string(output)) {
            output = fs.createReadStream(output);
        }

        output.on('error', (err) => {
            d.reject(err);
        });

        this.client.get(this.url(), {}, {
            json: false,
            headers: {
                'Accept': 'application/octet-stream'
            },
            process(r) {
                r.pipe(output);
            }
        })
        .then(() => {
            d.resolve();
        }, (err) => {
            d.reject(err);
        });

        return d.promise;
    }
}

module.exports = ReleaseAsset;
