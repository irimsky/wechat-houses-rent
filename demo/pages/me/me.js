// miniprogram/pages/me/me.js
var app = getApp();
var that
Page({

  actioncnt: function () {
    wx.showActionSheet({
      itemList: ['群聊', '好友', '朋友圈'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    new_request: false,
    new_preview: false,
    avaupdate: false,
    login: app.globalData.login
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    if (!app.globalData.login) {
      return
    }

    var identity = (getApp().globalData.ident == 'guest') ? '租赁者' : '房主'
    this.setData({
      identity: identity,
      phone: getApp().globalData.phone,
      name: getApp().globalData.name,
      ident: getApp().globalData.ident,
      login: app.globalData.login,
      avaurl: "你的头像图片链接",
    })
  },

  onShow: function (options) {
    if (!app.globalData.login) {
      return
    }
    if (this.data.avaupdate) {
      this.setData({
        avaurl: ："你的头像图片链接",
        avaupdate: false
      })
    }
    this.setData({
      phone: getApp().globalData.phone,
      name: getApp().globalData.name,
      ident: getApp().globalData.ident,

    })
    var cnt = 0
    if (app.globalData.ident == 'host') {
      wx.request({
        url: "你的服务器链接",
        success(res) {
          console.log(res.data)
          cnt = res.data
          if (cnt > 0) {
            wx.showTabBarRedDot({
              index: 2,
            })
            that.setData({
              new_request: true
            })
          } else {
            wx.hideTabBarRedDot({
              index: 2,
            })
            that.setData({
              new_request: false
            })
          }
        }
      })
    } else {
      wx.request({
        url: "你的服务器链接",
        success(res) {
          if (res.data == 1) {
            wx.showTabBarRedDot({
              index: 2,
            })
            that.setData({
              new_preview: true
            })
          } else {
            wx.hideTabBarRedDot({
              index: 2,
            })
            that.setData({
              new_preview: false
            })
          }
        }
      })
    }
  },

  /**
   * 收藏列表
   */
  onReqClick: function (event) {
    if (!app.globalData.login) {
      wx.showToast({
        title: '您尚未登录！',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../request/request',
    })
  },

  onPrevClick: function (event) {
    if (!app.globalData.login) {
      wx.showToast({
        title: '您尚未登录！',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../preview/preview',
    })
  },

  onOnRentClick: function (e) {
    if (!app.globalData.login) {
      wx.showToast({
        title: '您尚未登录！',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../rentout/rentout',
    })
  },

  onHistoryClick: function (e) {
    if (!app.globalData.login) {
      wx.showToast({
        title: '您尚未登录！',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../history/history',
    })
  },


  clickUser: function (e) {
    if (!app.globalData.login) {
      wx.navigateTo({
        url: '../Login/Login',
      })
      return
    }
    wx.navigateTo({
      url: '../../pages/user_info/user?phone=' + app.globalData.phone + "&ident=" + app.globalData.ident,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event);
  },

  outClick: function () {
    if (!app.globalData.login) {
      wx.showToast({
        title: '您尚未登录！',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '处理中',
    })
    app.globalData.login = false
    app.globalData.phone = ''
    app.globalData.ident = ''
    wx.clearStorage({})
    setTimeout(
      function () {
        wx.hideLoading({})
        that.setData({
          login: false
        })
      },
      500
    )

    this.onShow()
  }
})