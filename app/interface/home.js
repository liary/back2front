exports.getToplist = async (ctx) => {
	const res = await ctx.getData('https://portal.mycaigou.com/bid/get-last-bidding?&top=20')
	return JSON.parse(res.replace(/^\(|\)$/g, ''))
}