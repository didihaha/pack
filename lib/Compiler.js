const path = require('path'),
    fs = require('fs'),
    babylon = require('babylon'),
    traverse = require('@babel/traverse').default,
    type = require('@babel/types'),
    generator = require('@babel/generator').default

class Compiler {
    constructor (config) {
        this.config = config
        this.entryId = null
        this.modules = {}
        this.entryPath = config.entry
        this.root = process.cwd()
    }
    // 读取文件源码方法
    getSource (modulePath) {
        const code = fs.readFileSync(modulePath, 'utf8')
        return code
    }
    run () {
        const resolveEntryPath = path.resolve(this.root, this.entryPath)
        this.buildModule(resolveEntryPath, true)
        this.emitFile()
    }
    parse (code, parentPath) {
        const ast = babylon.parse(code)
        const dependencies = []
        // https://astexplorer.net/
        traverse(ast, {
            CallExpression (p) {
                const node = p.node
                if (node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__'
                    let moduleName = node.arguments[0].value                // 获取参数名
                    moduleName += path.extname(moduledName) ? '': '.js'     // 业务代码引入未带文件尾缀，这里添加
                    moduledName = './' + path.join(parentPath, moduledName)
                    dependencies.push(moduleName)                           // 推送到dependencies中存起来
                    node.arguments = [type.stringLiteral(moduleName)]       // 修改node的参数
                }
            }
        })
        const sourceCode = generator(ast).code
        return { sourceCode, dependencies }
    }
    /**
     * 
     * @param {*文件路径} modulePath 
     * @param {*是否是入口文件} isEntry 
     */
    buildModule (modulePath, isEntry) {
        // 获取入口文件代码
        const entryCode = this.getSource(modulePath),
            moduleName = './' + path.relative(this.root, modulePath)
        if (isEntry) {
            this.entryId = moduleName
        }
        const { sourceCode, dependencies } = this.parse(entryCode, path.dirname(modulePath))
        this.modules[moduleName] = sourceCode
        dependencies.forEach(dep => {  // 附模块的加载 递归加载
            this.buildModule(path.join(this.root, dep), false)
        })
    }
    // 输出文件
    emitFile() {

    }
}

module.exports = Compiler