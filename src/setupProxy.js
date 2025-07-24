const {createProxyMiddleware} = require('http-proxy-middleware');

// 用来解决跨域问题，反向代理
module.exports = function (app) {
    // app.use(proxy('标识符','配置项'))，这个可以多个，配置多个可反向代理网站的反向代理跨域
    app.use(
        '/rights',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true
        }));
};