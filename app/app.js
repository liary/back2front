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


const app = koa()
const isProduction = process.env.NODE_ENV === 'production'
				   ? true
				   : false

debug(`Server environment: ` + app.get('env'))

/**
 * inject request module into ctx.req
 */
app.use(injectRequest('getData'))

/**
 * register static routes
 * @param {String} static files mark, a request which start with this mark will handler by static routes
 * @param {String} static files path
 */
app.use(staticFiles('/static', `${__dirname}/static`))

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
	debug(`process ${ctx.req.method} ${ctx.req.url}`)
	const start = new Date().getTime()
	await next()
	const execTime = new Date().getTime() - start
	ctx.response.set('X-Response-Time', `${execTime}ms`)
}