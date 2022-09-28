let startY = 0;//手指起始坐标
let moveY = 0;//手指移动坐标
let moveDistance = 0;//手指移动距离

Page({
    data: {
        coverTransform: 'translateY(0)',
        coverTransition: ''
    },
    onLoad: function (options) {

    },
    handleTouchStart(event) {
        this.setData({
            coverTransition: ''
        })
        startY = event.touches[0].clientY
    },
    handleTouchMove(event) {
        moveY = event.touches[0].clientY;
        moveDistance = moveY - startY;

        if (moveDistance <= 0) {
            return;
        }
        if (moveDistance >= 80) {
            moveDistance = 80;
        }

        this.setData({
            coverTransform: 'translateY(' + moveDistance + 'rpx)'
        })
    },
    handleTouchEnd() {
        this.setData({
            coverTransform: 'translateY(0)',
            coverTransition: 'transform 0.5s linear'
        })
    }
});