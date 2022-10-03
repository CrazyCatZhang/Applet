import request from "../../utils/request";

Page({
    data: {},
    onLoad: function (options) {

    },

    handleGetOpenId() {
        wx.login({
            success: async (res) => {
                console.log(res)
                let code = res.code
                //将凭证发送给服务器
                let result = await request("/getOpenId", {code})
                console.log(result)
            }
        })
    },
});