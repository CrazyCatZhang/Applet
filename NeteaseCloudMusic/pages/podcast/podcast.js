import request from "../../utils/request";

Page({
    data: {
        videoGroupList: [],
        videoList: [],
        navId: '',
        videoId: '',
        videoUrl: '',
        videoUpdateTime: [],
        isTriggered: false
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

    async getVideoList(id, offset = 0) {
        const time = new Date().getTime()
        if (!id) {
            return
        }
        const videoListData = await request('/video/group', {time, id, offset})
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

        this.setData({
            videoList: offset ? [...this.data.videoList, ...videoList] : videoList,
            isTriggered: false
        })
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
        this.getVideoUrl(vid).then(url => {
            this.setData({
                videoUrl: url
            })
        })
        this.setData({
            videoId: vid
        })
        this.videoContext = wx.createVideoContext(vid)
        let {videoUpdateTime} = this.data
        let videoItem = videoUpdateTime.find(item => item.vid === vid)
        if (videoItem) {
            this.videoContext.seek(videoItem.currentTime);
        }
    },

    async getVideoUrl(vid) {
        const urlData = await request('/video/url', {id: vid})
        return urlData.urls[0].url
    },

    handleTimeUpdate(event) {
        let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
        let {videoUpdateTime} = this.data
        let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
        if (videoItem) {
            videoItem.currentTime = videoTimeObj.currentTime
        } else {
            videoUpdateTime.push(videoTimeObj)
        }

        this.setData({
            videoUpdateTime
        })
    },

    handleEnded(event) {
        let {videoUpdateTime} = this.data
        this.setData({
            videoUpdateTime: videoUpdateTime.filter(item => item.vid !== event.currentTarget.id)
        })
    },

    handleRefresher(event) {
        this.getVideoList(this.data.navId)
    },

    handleToLower() {
        this.getVideoList(this.data.navId, 8)
    }
});