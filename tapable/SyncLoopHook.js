// 如果其中某一个函数返回结果为true，循环调用该函数直到返回false
class SyncLoopHook {
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
        this.tasks.forEach(task => {
            do {
                res = task(..._args)
            } while (res)
            
        })
    }
}
// const { SyncLoopHook } = require('tapable')

const hookObj = new SyncLoopHook(['name'])
let index = 0
hookObj.tap('哈哈', function (name) {
    console.log('哈哈', name)
    ;++index
    return index !== 3
})
hookObj.tap('哈哈', function (name) {
    console.log('哈哈', name)
})

hookObj.call('你猜我是谁')