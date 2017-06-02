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
		config = defaults(optConfig, {
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
			let viewPath
			if (ctx._absTemplate) {
				viewPath = /^\//.test(ctx._absTemplate) ? ctx._absTemplate : ('/' + ctx._absTemplate)
			} else {
				if (view) {
					viewPath = ctx.routePath + view
				} else {
					viewPath = ctx.viewPath
				}
			}
			viewPath = 'pages' + viewPath + config.ext
			
			return env._renderAsync(viewPath, mergeContext)
		}
		ctx[config.renderFunctionName + 'Page'] = async (viewPath, mergeContext = { }) => {
			try {
				const html = await ctx[config.renderFunctionName](viewPath, mergeContext)
				ctx.response.body = html
			} catch(err) {
				throw new Error(err)
			}
		}
		await next()
	}
}

module.exports = nj