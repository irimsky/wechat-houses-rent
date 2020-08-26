var that
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    abled: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      phone: getApp().globalData.phone
    })
  },
  /**
   * 获取填写的内容
   */
  getTextAreaContent: function (event) {
    that.data.content = event.detail.value;
  },


  submit: function (e) {
    console.log(that.data.content)
    if (that.data.content == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '处理中',
    })
    this.setData({
      abled: false
    })
    wx.request({
      url: '你的服务器链接',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        text: that.data.content,
        phone: app.globalData.phone
      },
      success(res) {
        setTimeout(function (e) {
          var pages = getCurrentPages()
          var prevPage = pages[pages.length - 2]
          wx.navigateBack({
            delta: 1,
          })
          prevPage.onLoad()
        }, 2000)

        wx.showToast({
          title: '已完成',
        })


      },
      fail(res) {
        wx.hideLoading({})
        wx.showToast({
          title: '系统错误',
        })
        that.setData({
          abled: true
        })
        console.log(res)
      }
    })

  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})