/**
 * 响应请求预执行函数
 */

// 标准页面，不作预处理
const normalPage = (callback) => (ctx, next) => {
	callback(ctx, next)
}
exports.normal = normalPage

// 无预请求页面
const clientPage = (path = '') => (ctx, next) => {
	if (path) {
		path = ctx.viewPath.match(/[^\/]+$/)[0]
	}
	try {
		const html = await ctx.render(path)
		ctx.res.body = html
	} catch(err) {
		throw new Error(err)
	}
	await next()
}
exports.client = clientPage