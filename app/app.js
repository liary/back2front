/**
 * Module Dependences
 */
const koa = require('koa')
const path = require('path')
const debug = require('debug')('app.js')

/**
 * Preprocessing Module
 */
const staticFiles = require('./lib/static')
const njResgister = require('./lib/nunjucks')
const injectRequest = require('./lib/request')
const createRoutes = require('./routes/init')


const app = new koa()
const isProduction = process.env.NODE_ENV === 'production'
				   ? true
				   : false

/**
 * inject request module into ctx
 */
app.use(injectRequest('getData'))

/**
 * register static routes
 * @param {String} static files mark, a request which start with this mark will handler by static routes
 * @param {String} static files path
 */
app.use(staticFiles('/static', path.join(__dirname, '../static')))

/**
 * register nunjucks
 */
app.use(njResgister)

/**
 * @param {Array} register routes based each config object
 */
app.use(createRoutes([{
	dirPath: './views'
}]))

if (!isProduction) {
	app.use(async (ctx, next) => {
		debug(`process ${ctx.request.method} ${ctx.request.url}`)
		const start = new Date().getTime()
		await next()
		const execTime = new Date().getTime() - start
		ctx.response.set('X-Response-Time', `${execTime}ms`)
	})
}

module.exports = app