/**
 * nunjucks command
 */

// 引入外部CSS
exports.importCSS = (href) => {
	return '<link href="' + href + '" media="all" rel="stylesheet" type="text/css" />'
}

// 添加meta标签
exports.importMeta = (key, content) => {
	return '<meta name="' + key + '" content="' + content + '" />'
}

// 添加TDK标签
exports.importTDK = ({T, D, K}) => {
	return '<title>' + T + '</title>'
		 + '<meta name="description" content="' + D + '" />'
		 + '<meta name="keywords" content="' + K + '" />'
}

// 引入外部JS
exports.importJS = (src) => {
	return '<script src="' + src + '"></script>'
}

// JSON序列化
exports.jsonEncode = (obj) => {
	return JSON.stringify(obj)
}

// 对象是否存在
exports.exists = (obj) => {
	let result = obj != null;
	if (result) {
		if ( Array.isArray(obj) ) {
			result = obj.length > 0;
		} else if (typeof obj === 'string') {
			result = obj.trim() !== ''
		}
	}
	return result
}