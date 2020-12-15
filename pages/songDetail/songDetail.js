// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'


// 获取全局实例
const appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, // 音乐是否在播放
        song: {}, // 歌曲详情对象
        musicId: '', // 音乐的ID
        musicLink: '', //音乐的链接
        currentTime: '00:00', // 当前进度(实时时间)
        durationTime: '00:00', // 总时长
        currentWidth: 0, // 实时进度条的宽度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // option接收路由跳转的参数
        let musicId = options.musicId
        this.setData({
            musicId
        })
        // 获取音乐详情
        this.getMusicInfo(musicId)

        // 判断是否有音乐在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            // 修改当前页面的音乐播放状态为true
            this.setData({
                isPlay: true
            })
        }

        // 监听系统的控制音频播放
        // 创建控制音频播放的实例对象
        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
            // 修改全局音乐播放状态
            appInstance.globalData.musicId = musicId
        })
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })

        // 监听音乐播放自然结束
        this.backgroundAudioManager.onEnded(() => {
            // 自动切换至下一首音乐,自动播放
            PubSub.publish('switchType', 'next')
            // 进度条长度,实时播放时间 还原成0
            this.setData({
                currentWidth: 0,
                currentTime: '00:00'
            })
        })

        // 监听音乐实时播放的进度
        this.backgroundAudioManager.onTimeUpdate(() => {
            // 格式化实时播放时间
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450
            this.setData({
                currentTime,
                currentWidth
            })
        })
    },
    // 修改播放状态的功能函数
    changePlayState(isPlay) {
        appInstance.globalData.isMusicPlay = isPlay
        this.setData({
            isPlay
        })
    },

    // 获取音乐详情的功能函数
    async getMusicInfo(musicId) {
        let songData = await request('/song/detail', {
            ids: musicId
        })
        let durationTime = moment(songData.songs[0].dt).format('mm:ss')
        this.setData({
            song: songData.songs[0],
            durationTime
        })

        // 动态修改窗口标题
        wx.setNavigationBarTitle({
            title: this.data.song.name,
        })
    },

    // 点击播放/暂停的回调
    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        let {
            musicId,
            musicLink
        } = this.data
        this.musicControl(isPlay, musicId, musicLink)
    },

    // 控制音乐播放/暂停的功能函数
    async musicControl(isPlay, musicId, musicLink) {
        if (isPlay) {
            if (!musicLink) {
                // 获取音乐播放连接
                let musicLinkData = await request('/song/url', {
                    id: musicId
                })
                musicLink = musicLinkData.data[0].url
                this.setData({
                    musicLink
                })
            }
            this.backgroundAudioManager.src = musicLink;
            this.backgroundAudioManager.title = this.data.song.name
        } else {
            this.backgroundAudioManager.pause();
        }
    },

    // 点击切歌的回调
    handleSwitch(event) {
        // 获取切换类型
        let type = event.currentTarget.id

        // 关闭当前播放的音乐
        this.backgroundAudioManager.stop()

        PubSub.subscribe('musicId', (msg, musicId) => {
            // 获取音乐的详细信息
            this.getMusicInfo(musicId)
            // 自动播放当前歌曲
            this.musicControl(true, musicId)
            // 取消订阅
            PubSub.unsubscribe('musicId')
        })
        // 发布消息数据给recommendSong页面
        PubSub.publish('switchType', type)
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})