import request from "../../utils/request";
import '../../utils/lodash-fix'
import _ from '../../utils/lodash'

Page({
    data: {
        placeholderContent: '',
        hotList: [],
        searchContent: '',
        searchList: [],
        historyList: []
    },
    onLoad: function (options) {
        this.getInitData()
        this.getSearchHistory()
    },

    getSearchHistory() {
        let historyList = wx.getStorageSync('searchHistory');
        if (historyList) {
            this.setData({
                historyList
            })
        }
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
        this.getSearchList()
    }, 500),

    async getSearchList() {
        const {searchContent, historyList} = this.data

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

        if (historyList.indexOf(searchContent) !== -1) {
            historyList.splice(historyList.indexOf(searchContent), 1)
        }
        historyList.unshift(searchContent)
        this.setData({
            historyList
        })
        wx.setStorageSync('searchHistory', historyList)
    },

    handleDelete() {
        wx.showModal({
            content: '确认清空记录吗?',
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        historyList: []
                    })
                    wx.removeStorageSync('searchHistory');
                }
            }
        })
    },
});