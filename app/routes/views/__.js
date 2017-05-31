const pageType = require('../page-type')

module.exports = {
	'/say/:string': pageType.normal(async (ctx, next) => {
		try {
			const html = await ctx.render('index', {
				say: ctx.params.string || 'nothing'
			})
			ctx.res.body = html
		} catch(err) {
			console.log(err)
		}
		await next()
	}),
	'top': pageType.normal(async (ctx, next) => {
		let res, resErr, html
        try {
            res = await ctx.getData({
                url: 'https://m.b2bmir.com/act/top-developer-2017/get-top-developer'
            })
            let len = res.top500.length, lnums = Math.ceil(len / 2)
            res.top500l = res.top500.slice(0, lnums)
            res.top500r = res.top500.slice(lnums)
        } catch(err) {
            resErr = err || 'unexpected error'
        }
        if (resErr) res = {}
        try {
            html = await ctx.render('top', {
                list100: res.top100,
                list500l: res.top500l,
                list500r: res.top500r
            })
        } catch(err) {
            console.log(err)
        }
        ctx.response.body = html
        await next();
	})
}