// 上一个tapAsync注册的函数调用结果传递给下一个注册函数，链式调用
class AsyncSeriesWaterfallHook {
    constructor (args) {
        this.tasks = []
        this.argsLength = args.length
    }
    tapAsync (name, func) {
        this.tasks.push(func)
    }
    callAsync (...args) {
        let index = 0,
            nextParam = null
        const final = args.pop()
        const cb = (err, data) => {
            // 将当前cb参数存储起来，若中断直接以当前参数传递给最后的监听函数
            nextParam = data
            // 上一个函数返回true直接调用callAsync注册的函数
            if (err) {
                return final(nextParam)
            }
            const task = this.tasks[index]
            if (!task) return final(nextParam)
            if (index === 0) {
                task(...args, cb)
            } else {
                task(data, cb)
            }
            index++
        }
        cb()
    }
}

// const {AsyncSeriesWaterfallHook} = require('tapable')

const hookObj = new AsyncSeriesWaterfallHook(['name'])
hookObj.tapAsync('哈哈', (name, callback) => {
    setTimeout(() => {
        console.log('react', name)
        callback(true, '第一次调用')
    }, 1000)
})
hookObj.tapAsync('咯咯', (name, callback) => {
    setTimeout(() => {
        console.log('哈哈', name)
        callback(null, '第二次调用')
    }, 2000)
})

hookObj.callAsync('你猜我是谁', function (res) {
    console.log('最终监听的结果', res)
})
