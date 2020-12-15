# 说明

本微信小程序是一个仿网易云UI的音乐类小程序, 是跟着b站视频尚硅谷的微信小程序教程做的

目的是为了学习小程序的知识. 后续有时间再自己添加新的功能.

视频地址: [尚硅谷2021版微信小程序开发（零基础小程序开发入门到精通）](https://www.bilibili.com/video/BV12K411A7A2)

# 运行方式

新建`/utils/config.js`文件中,把以下代码写入该文件中:
```js
// 配置服务器相关信息
export default {
    ipHost: 'http://localhost:3000' // 服务器测试接口
}
```
该文件是NodeJS的接口, 服务端详细代码见b站视频下方评论区

如果把服务端部署在云服务器则把localhost改成你服务器的ip地址

也可以使用另一个网易云API项目: [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
但是这个API更新过后有一些接口已经不支持了,本项目的排行榜区域无法显示,需要自己更改
