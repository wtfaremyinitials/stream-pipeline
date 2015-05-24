var { Duplex, PassThrough } = require('readable-stream');

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
        this._unpipe();
        this.transforms.unshift(transform);
        this._repipe();
        return this;
    }

    addLast(transform) {
        this._unpipe();
        this.transforms.push(transform);
        this._repipe();
        return this;
    }

    addBefore(name, transform) {
        this._unpipe();
        var indx = this.getIndex(name);
        this.transforms.splice(indx + 0, 0, transform);
        this._repipe();
        return this;
    }

    addAfter(name, transform) {
        this._unpipe();
        var indx = this.getIndex(name);
        this.transforms.splice(indx + 1, 0, transform);
        this._repipe();
        return this;
    }

    remove(name) {
        this._unpipe();
        var indx = this.getIndex(name);
        this.transforms.splice(indx, 1);
        this._repipe();
        return this;
    }

    removeFirst() {
        this._unpipe();
        this.transforms.shift();
        this._repipe();
        return this;
    }

    removeLast() {
        this._unpipe();
        this.transforms.pop();
        this._repipe();
        return this;
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
