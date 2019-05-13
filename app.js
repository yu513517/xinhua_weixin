//app.js
App({
  data: {
    
  },
  onLaunch: function() {
    wx.showLoading()

    // 获取用户权限
    wx.getSetting({
      success(res) {
        res.authSetting = {
          "scope.userLocation": true
        }
      }
    })

    // 判断登陆状态，进行页面跳转
    wx.getStorage({
      key: 'loginState',
      success(res) {
        // 当前时间
        let timestamp = Date.parse(new Date());
        // 登陆过期时间
        let login_expiration = wx.getStorageSync('loginExpiration');

        if (login_expiration && login_expiration>timestamp || login_expiration == 'none') {
          wx.reLaunch({ url: '/pages/index/index' })
        } else {
          wx.reLaunch({ url: '/pages/login/login' })
        }
      },
      fail(res) {
        wx.reLaunch({ url: '/pages/login/login' })
      }
    })

    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: 'https://ts.ml-lengcan.com/',
    imgBaseUrl: 'http://code.ml-lengcan.com/KKKKKKKKKK/'
  }
})