import request from "../../utils/request";
import PubSub from 'pubsub-js'

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

        PubSub.subscribe('switchType', (msg, type) => {
            let {recommendList, index} = this.data;
            if (type === 'pre') {//上一首
                (index === 0) && (index = recommendList.length);
                index -= 1;
            } else {//下一首
                (index === recommendList.length - 1) && (index = -1);
                index += 1;
            }
            this.setData({
                index
            })
            let musicId = recommendList[index].id
            PubSub.publish('musicId', musicId)
        })
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