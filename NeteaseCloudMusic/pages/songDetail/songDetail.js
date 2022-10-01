import request from "../../utils/request";
import moment, {duration} from "moment";

Page({
    data: {
        isPlay: false,
        song: {},
        musicId: '',
        currentTime: '00:00',
        durationTime: '00:00'
    },
    onLoad: function (options) {
        const musicId = options.song
        this.setData({
            musicId
        })
        this.getMusicInfo(musicId)
    },

    async getMusicInfo(musicId) {
        const songData = await request('/song/detail', {ids: musicId})
        const durationTime = moment(songData.songs[0].dt).format('mm:ss')
        this.setData({
            song: songData.songs[0],
            durationTime
        })
        wx.setNavigationBarTitle({
            title: this.data.song.name
        })
    }
});