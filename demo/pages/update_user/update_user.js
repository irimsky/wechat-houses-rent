// pages/update_user/update_user.js
const app = getApp()
var that
var uploadImage = require('../../utils/uploadFile.js'); //地址换成你自己存放文件的位置
var util = require('../../utils/util.js');

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
    this.setData({
      ident: app.globalData.ident,
      phone: app.globalData.phone,
      avaSrc: "https://irimskydb.oss-cn-beijing.aliyuncs.com/avator/ava/" + app.globalData.ident + '/' + app.globalData.phone + '.jpg?' + Math.random() / 9999,
      name: options.name,
      ads: options.ads,
      id: options.id,
      gender: '男',
      abled: true,
      updateava: false
    })

  },

  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  OnAdsInput: function (e) {
    this.setData({
      ads: e.detail.value
    })
  },

  idInput: function (e) {
    this.setData({
      id: e.detail.value
    })
  },

  avaClick: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let imgSrc = res.tempFilePaths[0]
        that.setData({
          avaSrc: imgSrc,
          updateava: true
        })
      }
    })
  },

  genderChange: function (e) {
    if (e.detail.value == "1") {
      this.setData({
        gender: "男"
      })
    } else {
      this.setData({
        gender: "女"
      })
    }
  },

  updateClick: function (e) {
    if(this.data.ads==undefined){
      this.data.ads = ' '
    }
    var url = app.globalData.url + "op=update_user&name=" + encodeURI(this.data.name) + "&ads=" + encodeURI(this.data.ads) + "&ident=" + this.data.ident + "&phone=" + this.data.phone
    if (this.data.ident == 'guest') {
      url += "&id=" + this.data.id + "&sex=" + this.data.gender
    }
    wx.showLoading({
      title: '处理中',
    })
    this.setData({
      abled: false
    })
    wx.request({
      url: url,
      success(res) {
        if (res.data == 0) {
          wx.showToast({
            title: '修改成功',
          })
          //wx.clearStorageSync()
          var pages = getCurrentPages()
          var prevPage = pages[pages.length-3]
          prevPage.setData({
            avaupdate: true
          })
          wx.clearStorageSync()
          setTimeout(
            function (e) {
              wx.navigateBack({
                delta: 2,
              })
            }, 2000)

          wx.showToast({
            title: '修改完成',
          })
          app.globalData.name = that.data.name

        } else {
          wx.showToast({
            title: '系统错误！',
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '系统错误！',
          icon: 'none'
        })
        that.setData({
          abled: true
        })
      }
    })
    if (that.data.updateava) {
      uploadImage(that.data.avaSrc, this.data.phone, 'avator/ava/' + this.data.ident + '/',
        function (result) {
          console.log("======上传成功图片地址为：", result);
          //做你具体的业务逻辑操作

        },
        function (result) {
          console.log("======上传失败======", result);
          //做你具体的业务逻辑操作
          wx.showToast({
            title: '图片上传失败！',
            icon: 'none'
          })
          wx.hideLoading()
          return
        }
      )
    }

  },



})