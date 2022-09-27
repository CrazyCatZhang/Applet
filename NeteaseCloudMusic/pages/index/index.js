import request from "../../utils/request";

Page({
    data: {
        bannerList: [],
        recommendList: [],
        topList: []
    },
    onLoad: async function (options) {
        const bannerListData = await request('/banner')
        this.setData({
            bannerList: bannerListData.banners
        })
        const recommendListData = await request('/personalized')
        this.setData({
            recommendList: recommendListData.result,
        })
        const topListData = await request('/toplist/detail')
        const topListItems = topListData.list.filter(item => item.name.includes('云音乐')).sort((a, b) => b.subscribedCount - a.subscribedCount)
        let resultArr = []
        for (let i = 0; i < 5; i++) {
            const result = await request('/playlist/detail', {id: topListItems[i].id})
            let toplistDetail = {name: result.playlist.name, tracks: result.playlist.tracks.slice(0, 3)}
            resultArr.push(toplistDetail)
        }
        this.setData({
            topList: resultArr
        })
    }
});