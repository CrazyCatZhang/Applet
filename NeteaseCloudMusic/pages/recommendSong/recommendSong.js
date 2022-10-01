import request from "../../utils/request";

Page({
    data: {
        year: '',
        month: '',
        day: '',
        recommendList: []
    },
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo')
        if (!userInfo) {
            wx.showToast({
                title: '请先进行登录',
                icon: 'none',
                success: () => {
                    //跳转至登录界面
                    wx.reLaunch({
                        url: '/pages/login/login',
                    })
                }
            })
        }

        let nowTime = new Date()
        //更新日期
        this.setData({
            day: nowTime.getDate(),
            month: nowTime.getMonth() + 1,
            year: nowTime.getFullYear()
        })

        this.getRecommendList()
    },

    async getRecommendList() {
        let recommendListData = await request('/recommend/resource')


        this.setData({
            recommendList: recommendListData.recommend
        })

    },
});