//index.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    indexSwiperList: [], // 幻灯片
    noticeList: [], // 公告列表
    newsList: [], // 新闻列表
    newsImgLink: app.globalData.imgBaseUrl, // 新闻图片默认地址
    indexAdList: [], // 广告图片列表
  },

  // 首页数据加载
  loadIndexData() {
    var _this = this;
    // 获取秘钥
    var jingling = wx.getStorageSync('loginJingling');

    // 获取幻灯片
    let swiperData = {
      types: '幻灯片',
      nums: 3,
      jingling: jingling
    };
    util.post('wxHelper/slider.php', swiperData).then(res => {
      _this.setData({
        indexSwiperList: res.data
      })
    })

    // 获取公告列表
    let noticeData = {
      types: '公告',
      nums: 2,
      code: 1,
      jingling: jingling
    };
    util.post('wxHelper/Article.php', noticeData).then(res => {
      _this.setData({
        noticeList: res.data
      })
    })

    // 获取首页广告
    let indexAdData = {
      types: '首页广告',
      nums: 10,
      jingling: jingling
    };
    util.post('wxHelper/slider.php', indexAdData).then(res => {
      _this.setData({
        indexAdList: res.data
      })
    })

    // 获取新闻列表
    let newsData = {
      types: '新闻',
      nums: 1,
      code: 0,
      jingling: jingling
    };
    util.post('wxHelper/Article.php', newsData).then(res => {
      _this.setData({
        newsList: res.data
      })
    })
  },

  onLoad: function () {
    this.loadIndexData();
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.loadIndexData();
  }
})