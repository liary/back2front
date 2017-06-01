const pageType = require('../page-type')
const getlist = require('../../interface/home').getToplist

module.exports = {
	'/index': pageType.client(),
	'/index/:string': pageType.normal(async (ctx, next) => {
        let res, resErr, html
        // try {
        //     res = await ctx.getData('https://portal.mycaigou.com/bid/get-last-bidding?&top=20')
        // } catch(errMsg) {
        //     resErr = errMsg || 'unkown error'
        // }
        res = await getlist(ctx)
        await ctx.renderPage('index1', {
            say: ctx.params.string || 'hi',
            ctx: ctx,
            data: resErr || res
        })
        await next()
    })
}