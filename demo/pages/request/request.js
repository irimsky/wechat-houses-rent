// pages/request/request.js
var that
const app = getApp()
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ident: app.globalData.ident,
    user_phone: app.globalData.phone,
    loading: false
  },

  getData: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.url + "op=request_query&phone=" + app.globalData.phone + "&ident=" + app.globalData.ident,
      success(res) {
        that.setData({
          arr: res.data
        })
        console.log(that.data.arr)
        wx.hideLoading({})
        var hide_picker = []
        var picker_times = []
        var hs = []
        var time = util.formatTime(new Date());
        for (var i = 0; i < that.data.arr.length; i++) {
          hide_picker.push(true)
          picker_times.push(time)
          hs.push(new Date().getHours())
        }
        that.setData({
          loading: false,
          hide_picker: hide_picker,
          picker_times: picker_times,
          nowdate: time,
          nowhour: new Date().getHours(),
          hours: hs
        })
        console.log(hide_picker[0])
      },
      fail(res) {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '服务器错误！',
            })
          },
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      ident: app.globalData.ident,
      user_phone: app.globalData.phone,
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  accept_req: function (e) {
    var temp = this.data.hide_picker
    for (var i = 0; i < temp.length; i++)
      temp[i] = true
    temp[e.currentTarget.dataset.idx] = false
    this.setData({
      hide_picker: temp
    })
  },

  refuse_req: function (e) {

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
            firstName: that.data.hname,
            mobilePhoneNumber: e.currentTarget.dataset.phone,
            success: function (res_addphone) {
              console.log("电话添加联系人返回：", res_addphone)
            }
          })
        }
      }
    })
  },

  date_change: function (e) {
    var temp = this.data.picker_times
    for (var i = 0; i < temp.length; i++) {
      if (this.data.hide_picker[i] == false) {
        temp[i] = e.detail.value
      }
    }
    this.setData({
      picker_times: temp
    })
    let da = new Date(e.detail.value)
    console.log(da.getTime())
  },

  hour_change: function (e) {
    var temp = this.data.hours
    for (var i = 0; i < temp.length; i++) {
      if (this.data.hide_picker[i] == false) {
        temp[i] = e.detail.value
      }
    }
    this.setData({
      hours: temp
    })
    console.log(e)
  },

  verifyClick: function (e) {
    var idx = e.currentTarget.dataset.idx
    var date = new Date(this.data.picker_times[idx])
    date.setHours(this.data.hours[idx])
    var time = date.getTime()
    var arr = this.data.arr
    var url = app.globalData.url + "op=accept_request&hid=" + arr[idx].hid + "&date=" + time
    if (app.globalData.ident == 'host')
      url += "&hphone=" + app.globalData.phone + "&gphone=" + arr[idx].phone
    else
      url += "&hphone=" + arr[idx].phone + "&gphone=" + app.globalData.phone
    console.log(url)
    wx.showLoading({
      title: '处理中',
    })
    this.setData({
      loading: true
    })
    wx.request({
      url: url,
      success(res) {
        setTimeout(
          function (e) {
            that.getData()
          }, 3000
        )
        wx.hideLoading({})
        wx.showToast({
          title: '完成',
        })
      },
      fail(res) {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '系统错误！',
              icon: 'none'
            })
          },
        })
      }
    })

  },

  refuseClick: function (e) {
    var idx = e.currentTarget.dataset.idx
    var arr = this.data.arr
    var url = app.globalData.url + "op=refuse_request&hid=" + arr[idx].hid
    if (app.globalData.ident == 'host')
      url += "&hphone=" + app.globalData.phone + "&gphone=" + arr[idx].phone
    else
      url += "&hphone=" + arr[idx].phone + "&gphone=" + app.globalData.phone
    console.log(url)
    wx.showLoading({
      title: '处理中',
    })
    this.setData({
      loading: true
    })
    wx.request({
      url: url,
      success(res) {
        setTimeout(
          function (e) {
            that.getData()
          }, 2000
        )
        wx.hideLoading({})
        wx.showToast({
          title: '完成',
        })
      },
      fail(res) {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '系统错误！',
              icon: 'none'
            })
          },
        })
      }
    })
  }

})