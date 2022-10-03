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

    handleInputChange: _.debounce(function (event) {
        const searchContent = event.detail.value.trim()
        this.setData({
            searchContent
        })
        this.getSearchList(searchContent)
    }, 500),

    async getSearchList(searchContent) {
        if (!searchContent) {
            this.setData({
                searchList: []
            })
            return
        }
        const searchListData = await request('/search', {keywords: searchContent, limit: 10})
        this.setData({
            searchList: searchListData.result.songs
        })
    }
});