import request from "../../utils/request";

let startY = 0;//手指起始坐标
let moveY = 0;//手指移动坐标
let moveDistance = 0;//手指移动距离

Page({

    data: {
        coverTransform: 'translateY(0)',
        coverTransition: '',
        userInfo: {},
        recentPlayList: [],
        isLogin: false
    },

    onLoad: async function (options) {
        const userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        this.setData({
            userInfo,
            isLogin: true
        })
        this.getUserRecentList(this.data.userInfo.userId)
    },

    async getUserRecentList(uid) {
        const recentPlayListData = await request('/user/record', {uid, type: 0})
        let index = 0;
        let recentPlayList = recentPlayListData.allData.splice(0, 10).map(item => {
            item.id = index++;
            return item;
        })
        this.setData({
            recentPlayList: recentPlayList
        })
    },

    handleTouchStart(event) {
        this.setData({
            coverTransition: ''
        })
        startY = event.touches[0].clientY
    },

    handleTouchMove(event) {
        moveY = event.touches[0].clientY;
        moveDistance = moveY - startY;

        if (moveDistance <= 0) {
            return;
        }
        if (moveDistance >= 80) {
            moveDistance = 80;
        }

        this.setData({
            coverTransform: 'translateY(' + moveDistance + 'rpx)'
        })
    },

    handleTouchEnd() {
        this.setData({
            coverTransform: 'translateY(0)',
            coverTransition: 'transform 0.5s linear'
        })
    },
    toLogin() {
        wx.navigateTo({
            url: '/pages/login/login',
        })
    },
    async toLogout() {
        const status = await request('/logout')
        if (status.code === 200) {
            wx.removeStorageSync('userInfo')
            this.setData({
                userInfo: {},
                isLogin: false
            })
            wx.navigateTo({
                url: '/pages/login/login',
            })
            wx.showToast({
                title: '退出登录',
                icon: 'success'
            })
        }
    }
});