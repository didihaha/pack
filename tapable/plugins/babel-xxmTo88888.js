function letToVar() {
    const visitor = {
        VariableDeclaration(path) {
            path.node.declarations.forEach(item => {
                if (item.init.value === '@xxm') {
                    item.init.value = 88888
                }
            })
        }
    };
    return { visitor };
}

module.exports = letToVar;