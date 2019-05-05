// 调用call后,上一个函数调用的结果传入下一个函数
class SyncWaterfallHook {
    constructor (...args) {
        this.tasks = []
        this.argsLength = args.length
    }
    tap (name, func) {
        this.tasks.push(func)
    }
    call (...args) {
        let res = null
        const _args = args.slice(0, this.argsLength)
        if (this.tasks[0]) {
            res = this.tasks[0](..._args)
        }
        for (let i = 1; i < this.tasks.length; i++) {
            res = this.tasks[i](res)
        }
    }
}

// const { SyncWaterfallHook } = require('tapable')
const hookObj = new SyncWaterfallHook(['name'])
hookObj.tap('哈哈', function (name) {
    console.log('哈哈', name)
    return '老夫天下第一'
})
hookObj.tap('哈哈', function (name) {
    console.log('嘿嘿嘿', name)
    return '老夫天下第二'
})

hookObj.tap('哈哈', function (name) {
    console.log('嘿嘿嘿', name)
})

hookObj.call('你猜我是谁')
