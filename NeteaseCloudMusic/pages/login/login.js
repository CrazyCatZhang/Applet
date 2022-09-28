// pages/login/login.js
import request from "../../utils/request";
import '../../utils/lodash-fix'
import _ from '../../utils/lodash'

Page({

    /**
     * Page initial data
     */
    data: {
        send: true,
        alreadySend: false,
        phone: '',
        email: '',
        password: '',
        captcha: '',
        disabled: true,
        seconds: 10
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {

    },

    handleInput: _.debounce(function (event) {
        const type = event.currentTarget.id
        const value = event.detail.value
        if (type === 'phone' && value.length !== 11) {
            this.setData({
                disabled: true
            })
        }
        if (type === 'phone' && value.length === 11) {
            this.setData({
                disabled: false
            })
        }
        this.setData({
            [type]: value
        })
    }, 500),

    async getCode() {
        const {phone} = this.data

        let phoneRegResult = this.validatePhone(phone)
        if (!phoneRegResult) {
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none'
            })
            return
        }

        this.setData({
            alreadySend: true,
            send: false
        })
        this.timer()

        await request('/captcha/sent', {phone})
    },

    async login() {
        const {phone, captcha} = this.data
        if (!phone) {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none'
            })
            return
        }

        let phoneRegResult = this.validatePhone(phone)
        if (!phoneRegResult) {
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none'
            })
            return
        }

        const result = await request('/captcha/verify', {phone, captcha})
        if (result.code === 200) {
            const loginResult = await request('/login/cellphone', {phone, captcha})
            if (loginResult.code === 200) {
                wx.showToast({
                    title: '登陆成功',
                })

            }
        }
    },

    validatePhone(phone) {
        const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        return phoneReg.test(phone)
    },

    timer() {
        let promise = new Promise((resolve, reject) => {
            let setTimer = setInterval(
                () => {
                    this.setData({
                        seconds: this.data.seconds - 1,
                    })
                    if (this.data.seconds <= 0) {
                        this.setData({
                            seconds: 60,
                            alreadySend: false,
                            send: true,
                            disabled: false
                        })
                        resolve(setTimer)
                    }
                }, 1000)
        })
        promise.then((setTimer) => {
            clearInterval(setTimer)
        })
    }
})