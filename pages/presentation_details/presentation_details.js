// pages/presentation_details/presentation_details.js
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: app.globalData.imgBaseUrl,
    kehulogo: '',
    xuanchuan: '',
    kanchayuan: '',
    sertime: '',
    kehuname: '',
    address: '',
    jianchamudi: '',
    jianchafangfa: '',
    jianchashebei: '',
    xianchangqingkuang: '',
    dibuyu: '',
    gongsimingcheng: '',
    xianchang: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // 获取秘钥
    var jingling = wx.getStorageSync('loginJingling');

    // 获取文章详情
    let articleDetailsData = {
      id: options.id,
      jingling: jingling
    };
    util.post('wxHelper/BaogaoShow.php', articleDetailsData).then(res => {
      _this.setData({
        kehulogo: _this.data.imgBaseUrl + res.data.logo,
        xuanchuan: res.data.xuanchuan,
        kanchayuan: res.data.kanchayuan,
        sertime: res.data.sertime,
        kehuname: res.data.kehuname,
        address: res.data.address,
        jianchamudi: res.data.jianchamudi,
        jianchafangfa: res.data.jianchafangfa,
        jianchashebei: res.data.jianchashebei,
        xianchangqingkuang: res.data.xianchangqingkuang,
        dibuyu: res.data.dibuyu,
        gongsimingcheng: res.data.gongsimingcheng,
        xianchang: res.data.Xianchang
      })

      for (let i in _this.data.xianchang) {
        let riskList = _this.data.xianchang[i];
        switch(riskList.fengxiandengji) {
          case '高':
            _this.data.xianchang[i].riskColor = 'bg-red';
            _this.setData({
              xianchang: _this.data.xianchang
            });
            break;
          case '中':
            _this.data.xianchang[i].riskColor = 'bg-orange';
            _this.setData({
              xianchang: _this.data.xianchang
            });
            break;
          defaule:
            _this.data.xianchang[i].riskColor = 'bg-green';
            _this.setData({
              xianchang: _this.data.xianchang
            });
        }
      }

      // WxParse.wxParse('article', 'html', res.data.content, _this, 5)
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