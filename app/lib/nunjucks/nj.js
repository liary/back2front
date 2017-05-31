const path = require('path')
const nunjucks = require('nunjucks')
const lodash = require('lodash')
const { defaults, difference, merge } = lodash

/**
 * @type {Object}
 */
const defaultConfig = {
	ext: 'html',
	path: '',
	renderFunctionName: 'render',
	writeResponse: true,
	nunjucksConfig: { },
	envHandler: null,
	isProduction: true
}

/**
 * create nunjucks
 * @param {Object} optConfig
 */
const nj = (optConfig) => {
	let config = {}
	if (optConfig) {
		config = defaults(config, {
			isProduction: process.env.NODE_ENV === 'production' ? true : false
		})
	}

	defaults(config, defaultConfig)

	config.ext = config.ext
			   ? '.' + config.ext.replace(/^\./, '')
			   : ''
	
	const env = new nunjucks.Environment(
		new nunjucks.FileSystemLoader(config.path, {
			noCache: !config.isProduction,
			watch: !config.isProduction
		}), config.nunjucksConfig
	)

	/**
	 * create renderAsync function
	 * @param {String} view
	 * @param {Object} context
	 * @return {promise}
	 */
	env._renderAsync = (view, context = {}) => new Promise((resolve, reject) => {
		env.render(view, context, (err, res) => {
			if (err) {
				reject(err)
			} else {
				resolve(res)
			}
		})
	})

	if (typeof config.envHandler === 'function') {
		config.envHandler(env);
	}

	return async (ctx, next) => {
		if (ctx[config.renderFunctionName]) {
			throw new Error(`ctx.${config.renderFunctionName} is already defined`)
		}

		/**
		 * render function
		 * @param {string} view
		 * @param {Object} context
		 * @return {string}
		 */
		ctx[config.renderFunctionName] = async (view, context = { }) => {
			const mergeContext = merge({}, ctx.state, context)
			let viewPath = ctx.viewPath + view + config.ext
			if (view) {
				viewPath = ctx.routePath + view + config.ext
			} else {
				viewPath = ctx.viewPath + config.ext
			}
			viewPath = 'pages' + viewPath
			
			return env._renderAsync(viewPath, mergeContext)
		}
		await next()
	}
}

module.exports = nj