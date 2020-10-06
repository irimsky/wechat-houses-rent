// pages/register_rentout/register_rentout.js

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
     this.setData({
       hid: options.hid,
       ads: options.ads,
       hphone: app.globalData.phone,
       gphone: '',
       nowyear: new Date().getFullYear(),
       nowmonth: new Date().getMonth()+1,
       styear: new Date().getFullYear(),
       stmonth: new Date().getMonth()+1,
       edyear: new Date().getFullYear(),
       edmonth: new Date().getMonth()+1,
       eddate: new Date(),
       stdate: new Date()
     })
  },

  phone_input: function(e){
    this.setData({
      gphone: e.detail.value
    })
  },

  st_change: function(e){
    var s = e.detail.value
    var ym = s.split('-')
    if(ym[1][0]=='0') ym[1] = ym[1][1]
    this.setData({
      styear: ym[0],
      stmonth: ym[1],
      stdate: new Date(e.detail.value)
    })
  },

  ed_change: function(e){
    var s = e.detail.value
    var ym = s.split('-')
    if(ym[1][0]=='0') ym[1] = ym[1][1]
    this.setData({
      edyear: ym[0],
      edmonth: ym[1],
      eddate: new Date(e.detail.value)
    })
  },

  certify: function(e){
    if(this.data.eddate<=this.data.stdate){
      wx.showToast({
        title: '日期错误！',
        icon: 'none'
      })
      return
    }
    if(this.data.gphone.length!=11)
    {
      wx.showToast({
        title: '电话格式错误！',
        icon: 'none'
      })
      return
    }
    if(this.data.gphone == app.globalData.phone){
      wx.showToast({
        title: '不可以对自己签约',
        icon: 'none'
      })
      return
    }
    var url = '你的服务器连链接'
    console.log(url)
    wx.showLoading({})
    wx.request({
      url: url,
      success(res){
        setTimeout(
          function(e){
            wx.navigateBack({})
          }
          ,2000)
          wx.showToast({
            title: '成功',
          })
      },
      fail(res){

      }
    })
  }

})