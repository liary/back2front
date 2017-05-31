const path = require('path')
const mime = require('mime')
const fs = require('mz/fs')
const debug = require('debug')('staticFilesRegister')

const staticFiles = (url, dir) => async (ctx, next) => {
	const reqPath = onlyDownFind(ctx.req.path)
	if (reqPath.startsWith(url)) {
		const fp = path.join(dir, reqPath.substring(url.length))
		if (await fs.exists(fp)) {
			ctx.res.type = mime.lookup(reqPath)
			ctx.res.body = await fs.realFile(fp)
		} else {
			debug('unexpected error in find static files')
			ctx.res.status = 404
		}
	} else {
		await next()
	}
}

const onlyDownFind = (str = '') => {
	return str.replace(/\.+/g, '.')
}

module.exports = staticFiles