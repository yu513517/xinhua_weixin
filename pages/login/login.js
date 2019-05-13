// login.js
const util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  loginSubmit (e) {
    // 判断秘钥、用户名、密码不能为空
    if (e.detail.value.jingling == '' || e.detail.value.username == '' || e.detail.value.password == '') {
      // 显示提示信息（带确定按钮）
      wx.showModal({
        title: '用户名或密码不能为空！',
        showCancel: false
      })
    } else {
      // 提交信息到后台验证
      let loginData = {
        jingling: e.detail.value.jingling,
        username: e.detail.value.username,
        password: e.detail.value.password
      };

      util.post('wxHelper/X_LoginUser.php', loginData).then(res => {
        // 根据返回登陆状态，成功则跳转到首页，失败则弹出提示
        if (res.data == 'OK') {
        // 当前时间
        // let timestamp = Date.parse(new Date());
        // 登陆过期时间
        let login_expiration = 'none'; // timestamp + 10000，none为不限制超时
        
        // 本地储存登陆状态
        try {
          // 储存登陆状态
          wx.setStorageSync('loginState', 'OK')
          // 储存登陆超时时间
          wx.setStorageSync('loginExpiration', login_expiration)
          // 储存秘钥
          wx.setStorageSync('loginJingling', e.detail.value.jingling)
        } catch (e) { }

        // 登陆成功跳转到首页
        wx.showToast({
          title: '登陆成功！',
          duration: 1000,
          mask: true,
          success: function () {
            wx.reLaunch({
              url: '../index/index'
            })
          }
        })
      } else {
        wx.showToast({
          title: '登陆失败！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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