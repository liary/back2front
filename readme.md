# 目录结构
目录结构实例：
> Back2front
> ### app
> - lib
>
> 存放koa中间层
> - > nunjucks 模版引擎
> - > request 后端请求
> - > static 静态文件路由
>
> - > interface 接口请求处理
> 
> 按模块切分
>
> - routes 路由/control层，负责地址与页面之间的映射
> - > views 页面路由设置
> - > init 路由初始化
> - > page-type 页面渲染前处理函数
>
> - views 静态模版存放位置
> - > _layouts 布局相关文件，例如header.html、foot.html
> - > _widget 小部件，例如一些侧栏、弹窗
> - > pages 业务页面模版
>
> ### static 静态文件

项目开发
1. 在routes文件夹下找到对应的模块，根据业务需求在page-type.js找符合业务的块，如pageType.normal：
```javascript
//routes/home.js home模块路由
const pageType = require('../page-type')
module.exports = {
	'index': pageType.normal(async (ctx, next) => {
		//...
		//页面渲染操作
	})
}
```
2. 页面使用
[nunjucks模版](https://mozilla.github.io/nunjucks/cn/templating.html)，在项目views文件夹下的pages里的对应模块添加页面模版
```bash
touch views/home/index.html
```
3. 在static里存放静态文件，页面对应的js、css、image统一参考routes与页面模版的关系建立对应的文件夹存放，例如home/index路径对应的js存放在static/home/index/xx.js

额外重点
1. 页面渲染方法通过lib/nunjucks/nj.js在koa的全局对象ctx里挂载`render`方法，通过`ctx.render`可以调用nunjucks渲染模版，其中为了简便，同时也在ctx挂载了`renderPage`方法，`ctx.renderPage`本质是`ctx.render`调用并把返回值作为响应体(`ctx.response.body`)的语法糖。
2. 后端请求通过lib/request/index.js在koa全局对象ctx上挂了getData方法，所以在interface里写的请求处理函数需要传入参数ctx，这样才能使用`ctx.getData`
3. 更多可参考例子
4. node版本建议8.0.0以上

由于本项目接下来将用于公司node推广，故不再更新，项目之后的优化会往request换到fetch、请求方法不再与render一样挂载到ctx上，静态文件引用路径改为可配置，以配合cdn资源。

本项目深受[罗老师的back2front](https://github.com/heeroluo/back2front)启发，思路也主要参考罗老师在[前端讲坛](http://rostrum.jraiser.org)的精彩分享。
