// call后,如果tap的函数返回值为true，则终止后面的调用
class SyncBailHook {
    constructor (...args) {
        this.tasks = []
        this.argsLength = args.length
    }
    tap (name, func) {
        this.tasks.push(func)
    }
    call (...args) {
        const _args = args.slice(0, this.argsLength)
        for (let i = 0; i < this.tasks.length; i++) {
            const res = this.tasks[i](..._args)
            if (res) {
                return null
            }
        }
    }
}

// const { SyncBailHook } = require('tapable')
const hookObj = new SyncBailHook(['name'])
hookObj.tap('哈哈', function (name) {
    console.log('哈哈', name)
    // return true
})
hookObj.tap('哈哈', function (name) {
    console.log('嘿嘿嘿', name)
})

hookObj.call('你猜我是谁')
