// pages/index/index.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList: [], // 轮播图数据
        recommendList: [], // 推荐歌单的数据
        topList: [], //排行榜数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options){
        let bannerListData = await request('/banner', {type: 2});
        // console.log("结果数据: ", bannerListData)
        this.setData({
            bannerList: bannerListData.banners
        })

        let recommendListData = await request('/personalized',{limit: 10});
        this.setData({
            recommendList: recommendListData.result
        })

        // 获取排行榜数据
        /**
         * 根据idx的值获取对应的数据
         * idx范围是0-20,需要的是0-4,发送5次请求
         */
        let index = 0;
        let resultArray = [];
        while (index < 5){
            let topListData = await request('/top/list',{idx:index++});
            let topListItem = {
                name: topListData.playlist.name, 
                tracks: topListData.playlist.tracks.slice(0,3)
            };
            resultArray.push(topListItem);
            // 更新topList状态值
            this.setData({
                topList: resultArray
            })
        }
        
        
    },

    // 跳转至RecommendSong页面的回调
    toRecommendSong(){
        wx.navigateTo({
          url: '/pages/recommendSong/recommendSong',
        })
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