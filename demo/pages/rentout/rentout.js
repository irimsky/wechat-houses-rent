// pages/rentout/rentout.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ident: 'guest',
    phone: '18052786989'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: app.globalData.phone,
      ident: app.globalData.ident
    })
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + "op=query_rentout&phone=" + app.globalData.phone + "&ident=" + app.globalData.ident,
      success(res){
        var arr = res.data
        for(var i=0;i<res.data.length;i++)
        {
           arr[i].renttime = res.data[i].renttime.split('-')[0] + '年' + res.data[i].renttime.split('-')[1] +'月'
           arr[i].duetime = res.data[i].duetime.split('-')[0] + '年' + res.data[i].duetime.split('-')[1] +'月'
        }
        that.setData({arr: arr})
        wx.hideLoading({})
      }
    })

  },

  onReady: function () {

  },

  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})