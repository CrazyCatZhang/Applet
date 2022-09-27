import config from './config.js'

export default (url, data = {realIP: '192.168.2.124'}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.vercelHost + url,
            data,
            method,
            success(res) {
                resolve(res.data)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}