const path = require('path')
const nj = require('./nj')
const tplHelpers = require('./tpl-helper')

const njInject = nj({
	path: path.join('../views'),
	nunjucksConfig: {
		atuoescape: true
	},
	envHandler: (njEnv) => {
		for (let i in tplHelper) {
			njEnv.addGlobal(i, tplHelper[i])
		}
	}
})

module.exports = njInject