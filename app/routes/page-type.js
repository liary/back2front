/**
 * 响应请求预执行函数
 */

// 标准页面，不作预处理
const normalPage = (callback) => async (ctx, next) => {
	await callback(ctx, next)
}
exports.normal = normalPage

// 无预请求页面
const clientPage = (path = '') => async (ctx, next) => {
	if (path) {
		path = ctx.viewPath.match(/[^\/]+$/)[0]
	}
	ctx.renderPage(path)
	await next()
}
exports.client = clientPage

// 相对pages目录无需请求页面
const relativePage = (path = '') => async (ctx, next) => {
	ctx.renderPage(path)
	await next()
}
exports.relative = clientPage