import request from "../../utils/request";

Page({
    data: {
        videoGroupList: [],
        videoList: [],
        navId: '',
        videoId: '',
    },
    onLoad: function (options) {
        this.getVideoGroupList()
    },

    async getVideoGroupList() {
        const videoGroupListData = await request('/video/group/list')
        this.setData({
            videoGroupList: videoGroupListData.data.slice(0, 20),
            navId: videoGroupListData.data[0].id
        })
        this.getVideoList(this.data.navId)
    },

    async getVideoList(id) {
        if (!id) {
            return
        }
        const videoListData = await request('/video/group', {id})
        if (videoListData.datas.length === 0) {
            wx.showToast({
                title: '暂无推荐视频',
                icon: 'none'
            })
            return;
        }
        wx.hideLoading()
        let index = 0
        let videoList = videoListData.datas.map(item => {
            item.id = index++;
            return item;
        })
        this.setData({videoList})
    },

    changeNav(event) {
        const navId = event.target.id >>> 0
        this.setData({
            navId,
            videoList: []
        })
        wx.showLoading({
            title: '正在加载',
        })
        this.getVideoList(navId)
    },

    handlePlay(event) {
        let vid = event.currentTarget.id
        this.setData({
            videoId: vid
        })
        this.videoContext = wx.createVideoContext(vid)
    }
});