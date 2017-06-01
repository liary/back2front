const requireDir = require('require-dir')
const router = require('koa-router')()
const cookie = require('koa-cookie')
const forEach = require('lodash').forEach
const debug = require('debug')('routesRegister')

router.use(cookie.default())
const addRoute = ((router) => ({dirPath, useBasePath = false}) => {
	const routes = requireDir(dirPath, {recurse: true})
	const basePath = useBasePath ? (_.startsWith(dirPath, './') ? dirPath.substr(2, dirPath.length - 2) : dirPath) : ''

	forEach(routes, (subRoutes, key) => {
		const mpath = key === '__' ? '' : key

		forEach(subRoutes, (route, extendPath) => {
			const path = ('/' + basePath + '/' + mpath + '/' + extendPath).replace(/\/+/g, '/');
			const routePath = ('/' + basePath + '/' + mpath + '/').replace(/\/+/g, '/');
			router.get(path, async (ctx, next) => {
				ctx.routePath = routePath
				ctx.viewPath = path
				await route(ctx, next)
			})
			debug(`register ${path}`)
		})
	})
})(router)

module.exports = (arr = []) => {
	forEach(arr, (config, index) => {
		addRoute(config)
	})
	return router.routes()
}