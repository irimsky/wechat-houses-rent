// pages/user_info/user.js
const app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ads: ' '
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_phone: app.globalData.phone,
      phone: options.phone,
      ident: options.ident,
      identity: options.ident=='host'?'房主':'租赁者',
      avaurl: "https://irimskydb.oss-cn-beijing.aliyuncs.com/avator/ava/" + options.ident + '/' + options.phone + '.jpg?' + Math.random() / 9999,
    })
    that = this
    console.log(this.data.avaurl)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + "op=query_user_info&ident=" + that.data.ident + "&phone=" + that.data.phone,
      success(res){
        that.setData({
          reg_date: res.data.reg_date,
          name: res.data.name,
          ads: res.data.ads,
          rent_cnt: res.data.rent_cnt
        })
        if(that.data.ident=='guest'){
          that.setData({
            sex: res.data.sex,
            id: res.data.id
          })
        }
        else that.setData({
          sum_deal: res.data.sum_deal.toFixed(2)
        })
        wx.hideLoading({})
      }
    })
    if(this.data.ident=='host'){
      wx.request({
      url: app.globalData.url + "op=query_house_by_phone&phone=" + that.data.phone,
      success(res){
        console.log(res.data)
        var arr = res.data
        for(var i=0;i<arr.length;i++){
          arr[i].type = arr[i].type.split('，')
          arr[i].rent = arr[i].rent.toFixed(2)
        }
          
        that.setData({
          house_cnt: arr.length,
          houses: arr
        })
      }
    })
    }
  },

  onItemClick: function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id
    })
  },

  updateClick: function(e){
    var url = '../update_user/update_user?name=' + this.data.name + "&phone=" + this.data.phone
    if(this.data.ident == 'guest'){
      url += ("&id=" + this.data.id)
    }
    wx.navigateTo({
      url: url
    })
  }
})