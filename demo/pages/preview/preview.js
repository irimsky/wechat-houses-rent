// pages/preview/preview.js

var that
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    var url = '你的服务器链接'
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      success(res) {
        var arr = res.data
        console.log(arr)
        if (arr == null) {
          wx.showToast({
            title: '系统错误！',
            icon: 'none'
          })
          return
        }
        that.setData({
          arr: arr,
          ident: app.globalData.ident
        })
        wx.hideLoading({})
      },
      fail(res) {
        wx.showToast({
          title: '服务器错误！',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  phone_req: function (e) {
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function (res) {
        console.log("点击电话 res：", res)
        if (res.tapIndex == 0) { //直接呼叫
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone,
            success: function (res_makephone) {
              console.log("呼叫电话返回：", res_makephone)
            }
          })
        } else if (res.tapIndex == 1) { //添加联系人
          wx.addPhoneContact({
            firstName: '',
            mobilePhoneNumber: e.currentTarget.dataset.phone,
            success: function (res_addphone) {
              console.log("电话添加联系人返回：", res_addphone)
            }
          })
        }
      }
    })
  },
})