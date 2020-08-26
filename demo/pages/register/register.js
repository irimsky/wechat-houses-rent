// pages/register/register.js
var uploadImage = require('../../utils/uploadFile.js'); //地址换成你自己存放文件的位置
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    pswd: '',
    ident: "1",
    id: "",
    gender: "男",
    avaSrc: ''
  },

  identChange: function (e) {
    this.setData({
      ident: e.detail.value
    });
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

  passwordInput: function (e) {
    this.setData({
      pswd: e.detail.value
    });
    this.setData({
      pwdinput: true
    });
  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    });
    this.setData({
      phoneinput: true
    });
  },

  verpwdInput: function (e) {
    this.setData({
      verpwd: e.detail.value
    });
  },

  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    });
    this.setData({
      nameinput: true
    });
  },

  OnAdsInput: function (e) {
    this.setData({
      ads: e.detail.value
    });
    this.setData({
      adsinput: true
    });
  },

  idInput: function (e) {
    this.setData({
      id: e.detail.value
    });
    this.setData({
      idinput: true
    });
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
          avaSrc: imgSrc
        })
      }
    })
  },

  register: function (e) {
    var that = this
    var now_time = new Date()
    if (now_time - this.data.taptime < 1000) return;
    this.setData({
      taptime: now_time
    })
    var app = getApp()
    var data = this.data
    if (!this.data.phoneinput || !this.data.pwdinput || !this.data.nameinput || !this.data.adsinput) {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none'
      })

      return;
    }

    if (data.pswd.length <= 6 || data.pswd.length > 20) {
      wx.showToast({
        title: '密码长度应在7与20之间',
        icon: 'none'
      })
      return;
    }

    if (data.verpwd != data.pswd) {
      wx.showToast({
        title: '两次输入密码不一致',
        icon: 'none'
      })
      return;
    }

    if (this.data.phone.length != 11) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none'
      })
      return;
    }

    if (data.ident == "1" && data.id.length != 18) {
      wx.showToast({
        title: '身份证号格式错误',
        icon: 'none'
      })
      return;
    }

    // 加载
    wx.showToast({
      title: '请稍等',
      icon: 'loading',
      duration: 10000
    })



    if (data.ident == "2") {
      wx.request({
        url: app.globalData.url + 'op=reg_host&phone=' + data.phone + "&name=" + encodeURI(data.name) + "&ads=" + encodeURI(data.ads) + "&pswd=" + data.pswd,
        success(res) {
          console.log(res.data)
          if (res.data == "-1") {
            wx.showToast({
              title: '该用户已存在',
              icon: 'none'
            })
          } else if (res.data == "1") {
            wx.showToast({
              title: '数据库系统错误！',
              icon: 'none'
            })
          } else {
            setTimeout(function () {
              wx.navigateBack({})
            }, 1000)
            wx.showToast({
              title: '注册成功！',
            })
          }
        },
        fail(res) {
          console.log(res)
          wx.showToast({
            title: '注册失败！',
            icon: 'none'
          })
        },
      })
    } else {

      wx.request({
        url: app.globalData.url + 'op=reg_guest&phone=' + data.phone + "&name=" + encodeURI(data.name) + "&ads=" + encodeURI(data.ads) + "&pswd=" + data.pswd + "&sex=" + encodeURI(data.gender) + "&id=" + data.id,
        success(res) {
          console.log(res.data)
          if (res.data == "-1") {
            wx.showToast({
              title: '该用户已存在',
              icon: 'none'
            })
            return
          } else if (res.data == "1") {
            wx.showToast({
              title: '数据库系统错误！',
              icon: 'none'
            })
          } else {
            setTimeout(function () {
              wx.navigateBack({})
            }, 1000)
            wx.showToast({
              title: '注册成功！',
            })

          }
        },
        fail(res) {
          console.log(res)
        },
      })
    }

    uploadImage(that.data.avaSrc, this.data.phone, 'avator/ava/' + (this.data.ident == '1' ? 'guest' : 'host') + '/',
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
        that.setData({
          abled: true
        })
        return
      }
    )

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      taptime: new Date()
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