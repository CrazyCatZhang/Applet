import request from "../../utils/request";

Page({
    data: {
        year: '',
        month: '',
        day: '',
        recommendList: [],
        index: 0
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
        let recommendListData = await request('/recommend/songs')

        this.setData({
            recommendList: recommendListData.data.dailySongs
        })
    },

    toSongDetail(event) {
        const {song, index} = event.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
            url: '/pages/songDetail/songDetail?song=' + song.id
        })
    }
});