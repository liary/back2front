const path = require('path')
const nj = require('./nj')
const tplHelpers = require('./tpl-helper')

const njInject = nj({
	path: path.join(__dirname, '../../views'),
	nunjucksConfig: {
		atuoescape: true
	},
	envHandler: (njEnv) => {
		for (let i in tplHelpers) {
			njEnv.addGlobal(i, tplHelpers[i])
		}
	}
})

module.exports = njInject