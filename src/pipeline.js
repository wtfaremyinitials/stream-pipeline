var { Duplex, PassThrough } = require('stream');

// TODO: Central error handling

class StreamPipeline extends Duplex {

    constructor(transforms) {
        super();
        this.transforms = transforms || [];

        this.first = new PassThrough();
        this.last  = new PassThrough();

        this.first.once('finish', () => this.end());
        this.once('finish', () => this.first.end());

        this.last.on('data', e => {
            if(!this.push(e))
                last.pause();
        });

        this.last.once('end', () => this.push(null));

        this._repipe();
    }

    _read(n) {
        this.last.resume();
    }

    _write(chunk, enc, done) {
        this.first.write(chunk, enc, done);
    }

    addFirst(transform) {
        _unpipe();
        this.transforms.unshift(transform);
        _repipe();
    }

    addLast(transform) {
        _unpipe();
        this.transforms.push(transform);
        _repipe();
    }

    addBefore(name, transform) {
        _unpipe();
        var indx = this.getIndex(name);
        this.transforms.splice(indx + 0, 0, transform);
        _repipe();
    }

    addAfter(name, transform) {
        _unpipe();
        var indx = this.getIndex(name);
        this.transforms.splice(indx + 1, 0, transform);
        _repipe();
    }

    getIndex(name) {
        return this.transforms.reduce((p, c, i) => { c.name == name ? i : -1 }, -1);
    }

    _unpipe() {
        this.transforms.reduce((p, c) => p.unpipe(c), this.first).unpipe(this.last);
    }

    _repipe() {
        this.transforms.reduce((p, c) => p.pipe(c), this.first).pipe(this.last);
    }

}

module.exports = StreamPipeline;
