// article_details.js
const util = require('../../utils/util.js')
const WxParse = require('../../wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleTitle: '',
    articleAuthor: '',
    articleSertime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;

    // 获取文章详情
    let articleDetailsData = {
      id: options.id
    };
    util.post('wxHelper/Article_one.php', articleDetailsData).then(res => {
      _this.setData({
        articleTitle: res.data.data[0].title,
        articleAuthor: res.data.data[0].zuozhe,
        articleSertime: res.data.data[0].sertime
      })

      WxParse.wxParse('article', 'html', res.data.data[0].content, _this, 5)
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