exports.getTop = async (ctx) => {
	let res
	try {
		res = await ctx.getData('https://m.b2bmir.com/act/top-developer-2017/get-top-developer')
		let len = res.top500.length, lnums = Math.ceil(len / 2)
		res.top500l = res.top500.slice(0, lnums)
		res.top500r = res.top500.slice(lnums)
	} catch(err) {
		res = {}
		throw new Error(err || 'unexpected error')
	}
	return res
}