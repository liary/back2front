const pageType = require('../page-type')
const getTop = require('../../interface').getTop
const getlist = require('../../interface/home').getToplist

module.exports = {
	'/': pageType.normal(async (ctx, next) => {
		ctx.redirect('/top')
		ctx.status = 301
	}),
	'/say/:string': pageType.normal(async (ctx, next) => {
		try {
			const html = await ctx.render('index', {
				say: ctx.params.string || 'nothing'
			})
			ctx.response.body = html
		} catch(err) {
			console.log(err)
		}
		await next()
	}),
	'top': pageType.normal(async (ctx, next) => {
		let res, resErr, html
        // try {
        //     res = await ctx.getData('https://m.b2bmir.com/act/top-developer-2017/get-top-developer')
        //     let len = res.top500.length, lnums = Math.ceil(len / 2)
        //     res.top500l = res.top500.slice(0, lnums)
        //     res.top500r = res.top500.slice(lnums)
        // } catch(err) {
		// 	res = {}
        //     throw new Error(err || 'unexpected error')
        // }
		res = await getTop(ctx)
        await ctx.renderPage('top', {
                list100: res.top100,
                list500l: res.top500l,
                list500r: res.top500r
		})
        await next();
	})
}