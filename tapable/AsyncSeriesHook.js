class AsyncSeriesHook {
    constructor(args) {
        this.tasks = []
        this.argsLength = args.length
    }
    tapPromise(name, func) {
        this.tasks.push(func)
    }
    promise(...args) {
        const [first, ...others] = this.tasks
        const res = first(...args)
        return others.reduce((a, b) => {
            return a.then(() => b(...args))
        }, res)
    }
}

// const {AsyncSeriesHook} = require('tapable')

const hookObj = new AsyncSeriesHook(['name'])
hookObj.tapPromise('哈哈', (name, callback) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('react', name)
            resolve()
        })
    })
})
hookObj.tapPromise('咯咯', (name) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('哈哈', name)
            resolve()
        }, 2000)
    })
})

hookObj.promise('你猜我是谁').then(res => {
    console.log('end', res)
})
