// pages/update_house/update_house.js
const app = getApp()
var that
var uploadImage = require('../../utils/uploadFile.js'); //地址换成你自己存放文件的位置
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    abled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      id: options.id,
      ads: options.ads,
      type: options.type,
      pic_cnt: options.pic_cnt
    })
    var imgs = []
    for (var i = 1; i <= this.data.pic_cnt; i++)
      imgs.push(app.globalData.pic_url + this.data.id + '/' + i + '.jpg?' + Math.random() / 9999)
    this.setData({
      imgs: imgs,
      imgs_ori: imgs
    })

  },

  OnAdsInput: function (e) {
    this.setData({
      ads: e.detail.value
    })
  },

  OnTypeInput: function (e) {
    this.setData({
      type: e.detail.value
    })
  },

  OnMaxgInput: function (e) {
    this.setData({
      maxg: e.detail.value
    })
  },

  OnRentInput: function (e) {
    this.setData({
      rent: e.detail.value
    })
  },

  UploadImg: function () {
    var imgs = that.data.imgs
    wx.chooseImage({
      count: 6 - imgs.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let imgSrc = res.tempFilePaths
        imgs = imgs.concat(imgSrc)
        that.setData({
          pic_cnt: imgs.length,
          imgs: imgs
        })
      }
    })
    console.log(that.data.imgs)
  },

  RemoveImg: function (event) {
    var position = event.currentTarget.dataset.index;
    this.data.imgs.splice(position, 1);
    // 渲染图片
    this.setData({
      imgs: this.data.imgs,
      pic_cnt: this.data.pic_cnt - 1
    })
  },

  updateClick: function (e) {
    var rent = this.data.rent
    if (rent == undefined) {
      wx.showToast({
        title: '请输入正确的金额格式',
        icon: 'none'
      })
      return
    }
    var x = rent.split('.')
    console.log(x)
    if (x.length > 2) {
      wx.showToast({
        title: '请输入正确的金额格式',
        icon: 'none'
      })
      return
    }
    if (x.length == 2 && (x[1].length > 2 || x[1].length == 0)) {
      wx.showToast({
        title: '请输入正确的金额格式',
        icon: 'none'
      })
      return
    }
    if (x[0].length == 0) {
      wx.showToast({
        title: '请输入正确的金额格式',
        icon: 'none'
      })
      return
    }
    if (this.data.ads == '' || this.data.maxg == '' || this.data.rent == '') {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none'
      })
      return
    }
    if (this.data.pic_cnt == 0) {
      wx.showToast({
        title: '请附带至少一张预览图',
        icon: 'none'
      })
      return
    }
    this.data.type = this.data.type.replace(',', '，')
    this.data.ads = this.data.ads.replace('\n', ' ')
    wx.showLoading({
      title: '处理中……',
    })
    this.setData({
      abled: false
    })
    wx.request({
      url: app.globalData.url + 'op=update_house&ads=' + encodeURI(this.data.ads) + '&type=' + encodeURI(this.data.type) + '&rent=' + this.data.rent + '&piccnt=' + this.data.pic_cnt + '&maxg=' + this.data.maxg + '&hid=' + this.data.id,
      success(res) {
        if (res.data == -1) {
          wx.showToast({
            title: '数据库系统错误！',
            icon: 'none'
          })
          return
        }
        var id = that.data.id
        for (var i = 0; i < that.data.imgs.length; i++) {
          //显示消息提示框
          wx.showLoading({
            title: '上传中' + (i + 1),
            mask: true
          })
          if (that.data.imgs[i] == that.data.imgs_ori[i])
            continue
          uploadImage(that.data.imgs[i].split('?')[0], (i + 1).toString(), 'pics/' + id + '/',
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
              this.setData({
                abled: true
              })
              return
            }
          )
        }
        setTimeout(function () {
          var pages = getCurrentPages()
          wx.navigateBack({
            delta: 1
          })
          var prevPage = pages[pages.length - 2]
          prevPage.onLoad()
        }, 2000)

        wx.showToast({
          title: '修改成功！',
        })
      },
      fail(res) {
        wx.showToast({
          title: '发布失败！',
          icon: 'none'
        })
        console.log(res)
        this.setData({
          abled: true
        })
      }
    })

  },


})