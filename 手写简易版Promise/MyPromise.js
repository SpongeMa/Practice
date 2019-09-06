class MyPromise {

    constructor(handler) {

        this.status = MyPromise.PENDING;
        this.value = undefined;

        this.resolvedQueues = [];
        this.rejectedQueues = [];
        this.finallyQueues = [];

        handler(this._resolve.bind(this), this._reject.bind(this));

    }

    _resolve(val) {
        setTimeout(_ => {
            if (this.status !== MyPromise.PENDING) return;
            this.status = MyPromise.RESOLVED;
            this.value = val;

            let handler;
            while (handler = this.resolvedQueues.shift()) {
                handler(this.value);
            }

            this._finally(this.value);
        }, 0);
    }

    _reject(err) {
        setTimeout(_ => {
            if (this.status !== MyPromise.PENDING) return;
            this.status = MyPromise.REJECTED;
            this.value = err;

            let handler;
            while (handler = this.rejectedQueues.shift()) {
                handler(this.value);
            }

            this._finally(this.value);
        }, 0);
    }

    _finally(val) {
        setTimeout(_ => {
            let handler;
            while (handler = this.finallyQueues.shift()) {
                handler(this.value);
            }
        }, 0);
    }

    then(resolvedHandler, rejectedHandler) {
        return new MyPromise((resolve, reject) => {

            function newResolvedHandler(val) {
                if (typeof resolvedHandler === 'function') {
                    let result = resolvedHandler(val);
                    if (result instanceof MyPromise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } else {
                    resolve(val);
                }
            }

            function newRejectedHandler(err) {
                if (typeof rejectedHandler === 'function') {
                    let result = rejectedHandler(err);
                    if (result instanceof MyPromise) {
                        result.then(resolve, reject);
                    } else {
                        reject(result);
                    }
                } else {
                    reject(err);
                }
            }

            switch (this.status) {
                case MyPromise.PENDING:
                    this.resolvedQueues.push(newResolvedHandler);
                    this.rejectedQueues.push(newRejectedHandler);
                    break;
                case MyPromise.RESOLVED:
                    newResolvedHandler(this.value);
                    break;
                case MyPromise.REJECTED:
                    newRejectedHandler(this.value);
                    break;
            }

        });

    }

    catch (rejectedHandler) {
        return this.then(undefined, rejectedHandler);
    } finally(finallyHandler) {
        switch (this.status) {
            case MyPromise.PENDING:
                this.finallyQueues.push(finallyHandler);
                break;
            case MyPromise.RESOLVED:
                finallyHandler(this.value);
                break;
            case MyPromise.REJECTED:
                finallyHandler(this.value);
                break;
        }
    }

}
MyPromise.PENDING = 'PENDING';
MyPromise.RESOLVED = 'RESOLVED';
MyPromise.REJECTED = 'REJECTED';

MyPromise.resolve = function (val) {
    return new MyPromise(resolve => {
        resolve(val);
    });
}

MyPromise.reject = function (err) {
    return new MyPromise((resolve, reject) => {
        reject(err);
    });
}

MyPromise.all = function (iterator) {
    let len = iterator.length;
    let i = 0;
    let vals = [];

    return new MyPromise((resolve, reject) => {
        iterator.forEach(it => {
            it.then(val => {
                i++;
                vals.push(val);
                if (i === len) {
                    resolve(vals);
                }
            }).catch(err => {
                reject(err);
            });
        });
    });

}

MyPromise.race = function (iterator) {

    return new MyPromise((resolve, reject) => {
        iterator.forEach(it => {
            it.then(val => {
                resolve(val);
            }).catch(err => {
                reject(err);
            });
        });
    });

}

MyPromise.allSettled = function (iterator) {
    let len = iterator.length;
    let i = 0;
    let vals = [];

    return new MyPromise((resolve, reject) => {
        iterator.forEach(it => {
            it.finally(val => {
                i++;
                vals.push(val);
                if (i === len) {
                    resolve(vals);
                }
            })
        });
    });

}