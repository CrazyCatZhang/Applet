import request from "../../utils/request";

Page({
    data: {
        videoGroupList: [],
        navId: ''
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
        this.setData({videoList: videoListData.datas})
    },

    changeNav(event) {
        const navId = event.target.id >>> 0
        this.setData({
            navId
        })
    }
});