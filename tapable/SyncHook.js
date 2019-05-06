// 调用call后tap传入的函数依次执行
class SyncHook {
    constructor (args) {
        this.tasks = []
        this.argsLength = args.length
    }
    tap (name, func) {
        this.tasks.push(func)
    }
    call (...args) {
        const _args = args.slice(0, this.argsLength)
        this.tasks.forEach(task => {
            task(..._args)
        })
    }
}
// const { SyncHook } = require('tapable')

const hookObj = new SyncHook(['name'])
hookObj.tap('哈哈', function (name) {
    console.log('哈哈', name)
})
hookObj.tap('哈哈', function (name) {
    console.log('哈哈', name)
})

hookObj.call('你猜我是谁')