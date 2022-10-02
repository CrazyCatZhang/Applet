import request from "../../utils/request";
import moment from "moment";

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
        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true);
        })
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false);
        })
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false);
        })
    },

    changePlayState(isPlay) {
        this.setData({
            isPlay
        })
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
    },

    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        this.setData({
            isPlay
        })
        this.musicControl(isPlay, this.data.musicId)
    },

    async musicControl(isPlay, musicId) {
        const backgroundAudioManager = wx.getBackgroundAudioManager()
        if (isPlay) {
            let musicLinkData = await request('/song/url', {id: musicId})
            let musicLink = musicLinkData.data[0].url
            backgroundAudioManager.src = musicLink
            backgroundAudioManager.title = this.data.song.name
        } else {
            backgroundAudioManager.pause()
        }
    }
});