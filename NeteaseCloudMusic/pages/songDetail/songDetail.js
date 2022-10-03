import request from "../../utils/request";
import moment from "moment";
import PubSub from 'pubsub-js'

const appInstance = getApp()
Page({
    data: {
        isPlay: false,
        song: {},
        musicId: '',
        musicLink: '',
        currentTime: '00:00',
        durationTime: '00:00',
        currentWidth: '',
    },
    onLoad: function (options) {
        const musicId = options.song
        this.setData({
            musicId
        })
        this.getMusicInfo(musicId)

        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            //修改当前页面音乐播放状态
            this.setData({
                isPlay: true
            })
        }
        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
            appInstance.globalData.musicId = musicId
        })
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onTimeUpdate(() => {
            this.musicPlayTime()
        })
    },

    musicPlayTime() {
        let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
        let currentWidth = (this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration) * 450
        this.setData({
            currentTime,
            currentWidth
        })
    },

    changePlayState(isPlay) {
        this.setData({
            isPlay
        })
        appInstance.globalData.isMusicPlay = isPlay
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
        const {musicId, musicLink} = this.data
        this.musicControl(isPlay, musicId, musicLink)
    },

    async musicControl(isPlay, musicId, musicLink) {
        if (isPlay) {
            if (!musicLink) {
                let musicLinkData = await request('/song/url', {id: musicId})
                musicLink = musicLinkData.data[0].url
                this.setData({
                    musicLink
                })
            }
            this.backgroundAudioManager.src = musicLink
            this.backgroundAudioManager.title = this.data.song.name
        } else {
            this.backgroundAudioManager.pause()
        }
    },

    handleSwitch(event) {
        const type = event.currentTarget.id
        PubSub.subscribe('musicId', (msg, musicId) => {
            this.getMusicInfo(musicId)
            this.musicControl(true, musicId)
            PubSub.unsubscribe('musicId')
        })
        PubSub.publish('switchType', type)
    }
});