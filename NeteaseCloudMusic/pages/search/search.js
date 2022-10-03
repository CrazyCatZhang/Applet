import request from "../../utils/request";
import '../../utils/lodash-fix'
import _ from '../../utils/lodash'

Page({
    data: {
        placeholderContent: '',
        hotList: [],
        searchContent: '',
        searchList: []
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
    },

    handleInputChange: _.debounce(async function (event) {
        const searchContent = event.detail.value.trim()
        this.setData({
            searchContent
        })

        const searchListData = await request('/search', {keywords: searchContent, limit: 10})
        this.setData({
            searchList: searchListData.result.songs
        })
    }, 500)
});