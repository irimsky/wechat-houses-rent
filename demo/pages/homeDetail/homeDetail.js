var that
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_phone: '18052786989',
    user_ident: 'host',
    id: '',
    phone: '',
    ads: '',
    maxg: 1,
    rent: 0.00,
    type: '',
    name: '',
    hads: '',
    hphone: ''
  },

  onLoad: function (option) {
    this.setData({
      id: option.id,
      user_ident: app.globalData.ident,
      user_phone: app.globalData.phone
    })
    that = this
    wx.request({
      url: "你的服务器链接"
      success(res) {
        
        var imgs = []
        for (var i = 1; i <= res.data.pic_cnt; i++) {
          imgs.push("你的图片链接")
        }

        that.setData({
          img: imgs,
          id: res.data.id,
          rent: (res.data.rent).toFixed(2),
          maxg: res.data.maxg,
          types: res.data.type,
          type: res.data.type.split('，'),
          ads: res.data.ads,
          hname: res.data.hname,
          hads: res.data.hostads,
          hphone: res.data.hphone,
          status: res.data.status,
          pic_cnt: res.data.pic_cnt,
          avaurl: "你的图片链接"
        })

      },
      fail(res) {
        setTimeout(function (e) {
          wx.navigateBack({})
        }, 2000)
        wx.showToast({
          title: '该页面不存在',
          icon: 'none'
        })
        return
      }
    })
  },


  OnPhoneClick: function (e) {
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function (res) {
        console.log("点击电话 res：", res)
        if (res.tapIndex == 0) { //直接呼叫
          wx.makePhoneCall({
            phoneNumber: that.data.hphone,
            success: function (res_makephone) {
              console.log("呼叫电话返回：", res_makephone)
            }
          })
        } else if (res.tapIndex == 1) { //添加联系人
          wx.addPhoneContact({
            firstName: that.data.hname,
            mobilePhoneNumber: that.data.hphone,
            success: function (res_addphone) {
              console.log("电话添加联系人返回：", res_addphone)
            }
          })
        }
      }
    })

  },

  OnImgClick: function (e) {
    wx.previewImage({
      urls: this.data.img,
      current: e.currentTarget.dataset.idx
    })
  },

  OnReqClick: function (e) {
    if (!app.globalData.login) {
      wx.showToast({
        title: '您尚未登录！',
        icon: 'none'
      })
      return
    }
    if (app.globalData.ident == 'host') {
      wx.showToast({
        title: '只有租赁者才可以发起看房请求',
        icon: 'none'
      })
      return
    }
    if (app.globalData.phone == this.data.hphone) {
      wx.showToast({
        title: '不可以向自己发起看房请求',
        icon: 'none'
      })
      return
    }
    var url = "你的服务器链接"
    console.log(url)
    wx.request({
      url: url,
      success(res) {
        wx.showToast({
          title: '请求已发送',
        })
      },
      fail(res) {
        wx.showToast({
          title: '系统错误！',
          icon: 'none'
        })
      }
    })
  },

  OnRentClick: function (e) {
    if (!app.globalData.login) {
      wx.showToast({
        title: '您尚未登录！',
        icon: 'none'
      })
      return
    }
    if (this.data.status == '已出租') {
      wx.showToast({
        title: '该房屋已出租',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../register_rentout/register_rentout?hid=' + this.data.id + "&ads=" + this.data.ads,
    })
  },

  OnUserClick: function (e) {
    wx.navigateTo({
      url: '../user_info/user?ident=host&phone=' + this.data.hphone,
    })
  },

  OnEditClick: function (e) {
    if (!app.globalData.login) {
      wx.showToast({
        title: '您尚未登录！',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../update_house/update_house?id=' + this.data.id + '&ads=' + this.data.ads + '&type=' + this.data.types + '&pic_cnt=' + this.data.pic_cnt,
    })
  },

  OnDeleteClick: function (e) {
    if (!app.globalData.login) {
      wx.showToast({
        title: '您尚未登录！',
        icon: 'none'
      })
      return
    }
    if (this.data.status == '已租出') {
      wx.showToast({
        title: '不能删除已租出的房屋',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '删除',
      content: '确认删除该房屋？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中',
          })
          wx.request({
            url: "你的服务器链接",
            success(res) {
              if (res.data == 0) {

                setTimeout(
                  function () {
                    var pages = getCurrentPages()
                    var prevPage = pages[pages.length - 2] // 获取上一页
                    prevPage.onLoad()
                    wx.navigateBack({})
                  },
                  2000
                )
                wx.showToast({
                  title: '删除成功',
                })
              } else {
                wx.showToast({
                  title: '系统错误！',
                  icon: 'none'
                })
              }

            }
          })
        }
      }
    })
  }



})