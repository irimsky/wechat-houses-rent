var that
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    houses: [],
    all_houses: [],
    down: 0,
    up: 99999,
    keyword: '',
    showRent: 0,
    itemcnt: 0,
    ident: 'guest'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.getData()
    this.setData({
      ident: app.globalData.ident
    })
	
	
    var cnt = 0
    if (app.globalData.ident == 'host') { // 查询房主是否有新的看房请求
      wx.request({
        url: "你的服务器链接",
        success(res) {
          console.log(res.data)
          cnt = res.data
          if (cnt > 0) {
            wx.showTabBarRedDot({
              index: 2,
            })
          } else {
            wx.hideTabBarRedDot({
              index: 2,
            })
          }
        }
      })

    } 
    else { // 查询租赁者是否有新的看房记录
      wx.request({
        url: "你的服务器链接",
        success(res){
          if(res.data==1) // 有
          {
            wx.showTabBarRedDot({
              index: 2,
            })
          } else { // 无
            wx.hideTabBarRedDot({
              index: 2,
            })
          }
        }
      })
    }

  },

  onShow: function () {
    this.setData({
      ident: app.globalData.ident
    })
  },
  

  /*
   * 获取初始列表数据
   */
  getData: function () {
    that.setData({
      houses: [],
    })
    wx.showLoading({
      title: '加载中',
    })

    var url = "你的服务器链接"
    wx.request({
      url: url,
      success(res) {
        console.log(res.data)
        var arr = res.data
		
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].ads.length > 30) {
            arr[i].ads = arr[i].ads.substring(0, 28) + " …"
          }

          var s = arr[i]['type']

          var end = arr[i]['type'].length
          if (arr[i]['type'].length > 12) {
            end = 13
            for (var j = end; j >= 0; j--)
              if (s[j] == '，') {
                end = j;
                break;
              }
          }
          arr[i]['type'] = s.substring(0, end).split('，')
          arr[i].rent = arr[i].rent.toFixed(2)
        }
		
        that.setData({
          houses: arr,
          itemcnt: arr.length
        })
        wx.stopPullDownRefresh();
        wx.hideLoading({})
      }
    })
  },

  /**
   * item 点击
   */
  onItemClick: function (event) {
    var id = event.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    that.getData();
    wx.hideNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var temp = that.data.houses;
    // 获取后面二十条
    wx.showLoading({
      title: '加载中',
    })
    var url = "你的服务器链接"
    wx.request({
      url: url,
      success(res) {
        if (res.data.length == 0) { // 没有新数据
          wx.showToast({
            title: '没有更多数据了',
          })
        } else {
          var arr = res.data
          for (var i = 0; i < arr.length; i++) { // 对数据处理
            if (arr[i].ads.length > 30) {
              arr[i].ads = arr[i].ads.substring(0, 28) + " …"
            }

            var s = arr[i]['type']

            var end = arr[i]['type'].length
            if (arr[i]['type'].length > 12) {
              end = 13
              for (var j = end; j >= 0; j--)
                if (s[j] == '，') {
                  end = j;
                  break;
                }
            }
            arr[i]['type'] = s.substring(0, end).split('，')
            arr[i].rent = arr[i].rent.toFixed(2)
          }
          var hs = temp.concat(arr) // 将获取的新数据拼接到原列表上
          that.setData({ // 更新渲染页面
            houses: hs,
            itemcnt: that.data.itemcnt + 20
          })
          wx.hideLoading({})
        }
      }
    })
  },

  OnSearchInput: function (e) {
    var s = e.detail.value
    s.replace('%', '')
    s.replace('_', '') // 删除sql的通配符
    that.setData({
      keyword: s
    })
  },

  OnUpInput: function (e) {
    that.setData({
      up: e.detail.value
    })
  },

  OnDownInput: function (e) {
    that.setData({
      down: e.detail.value
    })
  },

  OnSearchClick: function (e) {
    that.setData({
      houses: []
    })
    that.getData()
  },

  OnCheckChange: function (e) {
    var t = this.data.showRent
    this.setData({
      showRent: 1 - t
    })
  },
  

  OnPostHouseClick: function (e) {
    wx.navigateTo({
      url: '../post_house/post_house',
    })
  }

})