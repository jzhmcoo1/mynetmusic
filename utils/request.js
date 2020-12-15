// 发送ajax请求
/**
 * 1. 封装功能函数
 * 2. 封装功能组件
 */

import config from './config'

export default (url, data={}, method='GET') => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.ipHost + url,
            data,
            method,
            header: {
                cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
            },
            success: (res) => {
                // console.log('请求成功: ', res);
                if(data.isLogin){// 登录请求
                  // 将用户的cookie存入至本地
                  wx.setStorage({
                    key: 'cookies',
                    data: res.cookies
                  })
                }
                resolve(res.data); // resolve修改promise的状态为成功状态resolved
            },
            fail: (err) => {
                // console.log("请求失败", err)
                reject(err); // 修改promise的状态为失败状态
            }
        })
    })
}
