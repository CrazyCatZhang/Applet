import request from "../../utils/request";

Page({
    data: {
        placeholderContent: '',
        hotList: []
    },
    onLoad: function (options) {
        this.getInitData()
    },

    async getInitData() {
        const placeholderData = await request('/search/default')
        const hotListData = await request('/search/hot/detail')
        this.setData({
            placeholderContent: placeholderData.data.showKeyword,
            hotList: hotListData.data
        })
    }
});