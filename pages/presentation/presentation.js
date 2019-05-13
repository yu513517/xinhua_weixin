// presentation.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ListPage: 1, // 页码
    presentationList: [], // 数据集合
    hasUpload: true, // 是否有更新,
    isLoading: { // 底部loading
      text: '加载中...',
      value: true
    }
  },

  // 获取勘察信息列表
  presentationUpdata(_this) {
    // 获取秘钥
    var jingling = wx.getStorageSync('loginJingling');

    // 勘察信息
    let presentationData = {
      code: 0,
      nums: _this.data.ListPage,
      jingling: jingling
    };
    util.post('wxHelper/BaogaoSel.php', presentationData).then(res => {
      _this.setData({
        presentationList: res.data
      })
    })
  },

  // 下拉加载更多
  presentationPageto(_this) {
    if (_this.data.hasUpload) {
      // 显示提示信息
      _this.setData({
        isLoading: {
          value: true
        }
      })

      // 获取秘钥
      var jingling = wx.getStorageSync('loginJingling');

      // 勘察信息
      let presentationData = {
        code: 0,
        nums: _this.data.ListPage + 1,
        jingling: jingling
      };
      util.post('wxHelper/BaogaoSel.php', presentationData).then(res => {
        // 原json对象转数组
        let presentationData = [];
        for (let i in _this.data.presentationList) {
          presentationData.push(_this.data.presentationList[i])
        }
        // 新json对象转数组
        let resData = [];
        for (let i in res.data) {
          resData.push(res.data[i])
        }
        // 最终数据
        let finalData = presentationData.concat(resData);
        
        if (resData.length < 10) {
          _this.setData({
            ListPage: _this.data.ListPage + 1,
            presentationList: finalData,
            hasUpload: false,
            isLoading: {
              text: '没有更多了o(╯□╰)o',
              value: false
            }
          })
        } else {
          _this.setData({
            ListPage: _this.data.ListPage + 1,
            presentationList: finalData,
            isLoading: {
              value: true
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.presentationUpdata(this)
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
    wx.stopPullDownRefresh();
    this.presentationUpdata(this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.stopPullDownRefresh();
    this.presentationPageto(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})