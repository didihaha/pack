class AsyncParallelHook {
    constructor (args) {
        this.tasks = []
        this.argsLength = args.length
    }
    tapAsync (name, func) {
        this.tasks.push(func)
    }
    callAsync (...args) {
        let index = 0
        const final = args.pop()
        const cb = () => {
            ++index
            if (index === this.tasks.length) {
                final()
            }
        }
        this.tasks.forEach(task => {
            task(...args, cb)
        })
    }
}

// const {AsyncParallelHook} = require('tapable')

const hookObj = new AsyncParallelHook(['name'])
hookObj.tapAsync('哈哈', (name, callback) => {
    setTimeout(() => {
        console.log('react', name)
        callback()
    }, 1000)
})
hookObj.tapAsync('咯咯', (name, callback) => {
    setTimeout(() => {
        console.log('哈哈', name)
        callback()
    }, 2000)
})

hookObj.callAsync('你猜我是谁', function () {
    console.log('end')
})