// pages/message/message.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ListPage: 1, // 页码
    messageList: [], // 数据集合
    hasUpload: true, // 是否有更新,
    isLoading: { // 底部loading
      text: '加载中...',
      value: true
    }
  },

  // 获取信息列表
  messageUpdata(_this) {
    // 获取秘钥
    var jingling = wx.getStorageSync('loginJingling');

    // 信息
    let messageData = {
      types: '站内信',
      nums: _this.data.ListPage,
      jingling: jingling
    };
    util.post('wxHelper/Article.php', messageData).then(res => {
      _this.setData({
        messageList: res.data
      })
    })
  },

  // 下拉加载更多
  messagePageto(_this) {
    if (_this.data.hasUpload) {
      // 显示提示信息
      _this.setData({
        isLoading: {
          value: false
        }
      })

      // 获取秘钥
      var jingling = wx.getStorageSync('loginJingling');

      // 勘察信息
      let messageData = {
        types: '站内信',
        nums: _this.data.ListPage + 1,
        jingling: jingling
      };
      util.post('wxHelper/Article.php', messageData).then(res => {
        // 原json对象转数组
        let messageData = [];
        for (let i in _this.data.messageList) {
          messageData.push(_this.data.messageList[i])
        }
        // 新json对象转数组
        let resData = [];
        for (let i in res.data) {
          resData.push(res.data[i])
        }
        // 最终数据
        let finalData = messageData.concat(resData);
        
        if (resData.length < 10) {
          _this.setData({
            ListPage: _this.data.ListPage + 1,
            messageList: finalData,
            hasUpload: false,
            isLoading: {
              text: '没有更多了o(╯□╰)o',
              value: false
            }
          })
        } else {
          _this.setData({
            ListPage: _this.data.ListPage + 1,
            messageList: finalData,
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
    this.messageUpdata(this)
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
    this.messageUpdata(this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.stopPullDownRefresh();
    this.messagePageto(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})