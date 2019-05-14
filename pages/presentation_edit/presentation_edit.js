// pages/presentation_edit/presentation_edit.js
const app = new getApp()
const util = require('../../utils/util.js')
const wxmap = require('../../wxMapApi/qqmap-wx-jssdk.min.js')
var mapspk = new wxmap({
  key: 'W2VBZ-2FMRF-MO2JE-NPZRR-SNC67-2FBSO'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalName: null,  // 绑定弹出框名称
    jingling: wx.getStorageSync('loginJingling'),  // 获取秘钥

    selects_mudi: [],   // 勘察目的默认数据
    selects_fangfa: [],  // 勘察方法默认数据
    selects_shebei: [],  // 勘察设备默认数据
    selects_qingkuang: [],  // 现场情况默认数据
    selects_quyu: [],  // 检测区域默认数据
    selects_yushe: [],  // 预设默认数据

    problemList: [{  // 现场存在问题数组
      xianchangzhaopian: '',  // 现场照片
      fengxiandengji: [{
        id: 0,
        name: '低'
      }, {
        id: 1,
        name: '中'
      }, {
        id: 2,
        name: '高'
      }],
      fengxiandengjiChecked: 0,
      jianchaquyu: [],  // 检查区域
      jianchaquyuChecked: 0,
      jianchayushe: [],  // 预设
      existingProblems: '',  // 存在问题
      suggestions: '',  // 改进意见
      yusheChecked: 'true',  // 预设or手动输入
      canDel: ''  // 是否可删
    }],

    submitData: {
      kancharenyuan: '',
      kanchariqi: '',
      kehumingcheng: '',
      kehudizhi: '',
      latitude_num: '',
      longitude_num: '',
      jianchamudi: [],
      jianchafangfa: [],
      jianchashebei: [],
      xianchangqingkuang: [],
      neibubeizhu: '',
      wenti: [{
        xianchangzhaopian: '',
        fengxiandengji: 0,
        jianchaquyu: 0,
        yusheChecked: 'true',
        jianchayushe: [],
        cunzaiwenti: '',
        gaijinyijian: ''
      }]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;

    // 设置下拉多选数据
    var selectsData = {
      jingling: this.data.jingling
    };

    // 设置默认信息
    var defaultData = {
      jingling: this.data.jingling,
      code: options.id
    };

    // 设置下拉框默认信息
    
    util.post('wxHelper/baogaoYs.php', selectsData).then(res => {
      _this.setData({
        selects_mudi: res.data.jianchamudi,
        selects_fangfa: res.data.jianchafangfa,
        selects_shebei: res.data.jianchashebei,
        selects_qingkuang: res.data.xianchangkancha,
        selects_quyu: res.data.jianchaquyu,
        selects_yushe: res.data.jianchayushe,
      })

      util.post('wxHelper/baogaoupYs.php', defaultData).then(default_res => {
        // 勾选检查目的
        _this.data.selects_mudi.forEach((selects_mudi_data) => {
          default_res.data.jianchamudi.forEach((jianchamudi_data) => {
            if (selects_mudi_data.id == jianchamudi_data) {
              selects_mudi_data.checked = 'true'
            }
          })
        })
        // 勾选检查方法
        _this.data.selects_fangfa.forEach((selects_fangfa_data) => {
          default_res.data.jianchafangfa.forEach((jianchafangfa_data) => {
            if (selects_fangfa_data.id == jianchafangfa_data) {
              selects_fangfa_data.checked = 'true'
            }
          })
        })
        // 勾选检查设备
        _this.data.selects_shebei.forEach((selects_shebei_data) => {
          default_res.data.jianchashebei.forEach((jianchashebei_data) => {
            if (selects_shebei_data.id == jianchashebei_data) {
              selects_shebei_data.checked = 'true'
            }
          })
        })
        // 勾选现场情况
        _this.data.selects_qingkuang.forEach((selects_qingkuang_data) => {
          default_res.data.xianchangqingkuang.forEach((xianchangqingkuang_data) => {
            if (selects_qingkuang_data.id == xianchangqingkuang_data) {
              selects_qingkuang_data.checked = 'true'
            }
          })
        })

        var problemList = [];
        var problemList_index = 0;
        var submitData_wenti = [];
        var problemList_selects_yushe = [];
        
        default_res.data.wenti.forEach((wenti_data) => {
          // 设置检查区域选中下标
          var jianchaquyuIndex = 0;
          for (var i = 0; i < _this.data.selects_quyu.length; i++) {
            if (_this.data.selects_quyu[i].id == wenti_data.jianchaquyu) {
              jianchaquyuIndex = i
            }
          }

          // 勾选预设
          _this.data.selects_yushe.forEach(selects_yushe_data => {
            var obj = {}
            for (var i in selects_yushe_data) {
              obj[i] = selects_yushe_data[i]
            }
            
            problemList_selects_yushe.push(obj)
          })
          problemList_selects_yushe.forEach((yushe_data, yushe_index) => {
            wenti_data.yusheid.forEach((yusheid_data) => {
              if (yushe_data.id == yusheid_data) {
                problemList_selects_yushe[yushe_index].checked = 'true'
              }
            })
          })

          console.log(wenti_data)

          problemList.push({
            xianchangzhaopian: (wenti_data.img_address ? app.globalData.baseUrl + wenti_data.img_address : wenti_data.img_address),
            fengxiandengji: [{
              id: 0,
              name: '低'
            }, {
              id: 1,
              name: '中'
            }, {
              id: 2,
              name: '高'
            }],
            fengxiandengjiChecked: wenti_data.fengxiandengji,
            jianchaquyu: _this.data.selects_quyu,
            jianchaquyuChecked: jianchaquyuIndex,
            jianchayushe: problemList_selects_yushe,
            existingProblems: wenti_data.cunzaiwenti,
            suggestions: wenti_data.gaijinyijian,
            yusheChecked: wenti_data.yushe,
            canDel: (problemList_index == 0 ? '' : 'true')
          })

          submitData_wenti.push({
            xianchangzhaopian: wenti_data.img_address,
            fengxiandengji: wenti_data.fengxiandengji,
            jianchaquyu: wenti_data.jianchaquyu,
            yusheChecked: wenti_data.yushe,
            jianchayushe: wenti_data.yusheid != '' ? wenti_data.yusheid : [],
            cunzaiwenti: wenti_data.cunzaiwenti,
            gaijinyijian: wenti_data.gaijinyijian
          })

          problemList_index = 1
          problemList_selects_yushe = []
        })

        _this.setData({
          problemList: problemList,

          ['submitData.ddid']: default_res.data.ddid,
          ['submitData.kancharenyuan']: default_res.data.kanchayuan,
          ['submitData.kanchariqi']: default_res.data.kanchariqi,
          ['submitData.kehumingcheng']: default_res.data.kehuname,
          ['submitData.kehudizhi']: default_res.data.address,
          ['submitData.jianchamudi']: default_res.data.jianchamudi,
          ['submitData.jianchafangfa']: default_res.data.jianchafangfa,
          ['submitData.jianchashebei']: default_res.data.jianchashebei,
          ['submitData.xianchangqingkuang']: default_res.data.xianchangqingkuang,
          ['submitData.neibubeizhu']: default_res.data.beizhu,
          ['submitData.wenti']: submitData_wenti
        })
      })
    })
  },

  // 新增问题
  newProblems: function() {
    var newProblems = {
      xianchangzhaopian: '',
      fengxiandengji: [{
        id: 0,
        name: '低'
      }, {
        id: 1,
        name: '中'
      }, {
        id: 2,
        name: '高'
      }],
      fengxiandengjiChecked: 0,
      jianchaquyu: this.data.selects_quyu,
      jianchaquyuChecked: 0,
      jianchayushe: this.data.selects_yushe,
      existingProblems: '',
      suggestions: '',
      yusheChecked: 'true',
      canDel: 'true'
    };
    var newWenti = {
      xianchangzhaopian: '',
      fengxiandengji: 0,
      jianchaquyu: 0,
      yusheChecked: 'true',
      jianchayushe: [],
      cunzaiwenti: '',
      gaijinyijian: ''
    };

    this.data.problemList.push(newProblems)
    this.data.submitData.wenti.push(newWenti)
    this.setData({
      problemList: this.data.problemList,
      ['submitData.wenti']: this.data.submitData.wenti
    })
  },

  // 删除问题
  delProblems: function(e) {
    this.data.problemList.splice(e.target.dataset.index, 1)
    this.data.submitData.wenti.splice(e.target.dataset.index, 1)
    this.setData({
      problemList: this.data.problemList,
      ['submitData.wenti']: this.data.submitData.wenti
    })
  },

  // 获取用户当前位置
  getUserLocation: function(e) {
    var _this = this;

    wx.showLoading({
      title: '获取位置中...'
    })

    // mapspk.reverseGeocoder({
    //   success: function(res) {
    //     _this.setData({
    //       ['submitData.kehudizhi']: res.result.formatted_addresses.recommend
    //     })
    //     wx.hideLoading()
    //   },
    //   fail: function() {
    //     wx.hideLoading()
    //   }
    // })

    wx.chooseLocation({
      type: 'wgs84',
      success(res) {
        _this.setData({
          latitude_num: res.latitude,
          longitude_num: res.longitude,
          ['submitData.kehudizhi']: res.address
        })
        wx.hideLoading()
      },
      fail() {
        wx.hideLoading()
      }
    })
  },

  // 选择现场照片
  chooseScenePhotos: function(e) {
    var _this = this;

    wx.chooseImage({
      conunt: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        // 显示上传中提示
        wx.showToast({
          title: '图片上传中...',
          icon: 'loading',
          mask: true
        })

        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.baseUrl + 'wxHelper/baogao_upPIC.php',
          filePath: tempFilePaths[0],
          name: 'imgfiles',
          success: function(res) {
            console.log(res)
            _this.setData({
              ['problemList['+ e.target.dataset.index +'].xianchangzhaopian']: tempFilePaths[0],
              ['submitData.wenti['+ e.target.dataset.index +'].xianchangzhaopian']: res.data
            })
            wx.hideToast()
          },
          fail: function(res) {
            wx.showToast({
              title: res.data,
              icon: 'none',
              mask: true,
              duration: 2000
            })
          }
        })
      }
    })
  },

  // 显示弹出框
  showModal: function(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  // 隐藏弹出框
  hideModal: function(e) {
    this.setData({
      modalName: null
    })
  },

  // 确定修改
  submitPresentation: function() {
    var addData = {
      jingling: this.data.jingling,
      dates: this.data.submitData
    }
    util.get('wxHelper/baogaoUP.php', addData).then(res => {
      wx.showToast({
        title: '修改成功',
        mask: true,
        success: function() {
          setTimeout(function() {
            wx.reLaunch({ url: '/pages/presentation/presentation' })
          }, 2000)
        }
      })
    })
  },

  // 单选绑定事件
  selectorChange: function(e) {
    var value = e.detail.value;
    var selectName = e.target.dataset.selectName;

    if (e.target.dataset.index != null && e.target.dataset.itemkey != null && e.target.dataset.itemkey != '') {
      var key = e.target.dataset.key + '['+ e.target.dataset.index +'].' + e.target.dataset.itemkey;
    } else {
      var key = e.target.dataset.key;
    }

    if (e.target.dataset.checkedName != null) {
      var checkedIndex = e.target.dataset.index;
      var checkedName = e.target.dataset.checkedName;
      this.setData({
        ['problemList['+ checkedIndex +'].' + checkedName]: value
      })
    }

    if (selectName) {
      this.setData({
        [key]: this.data[selectName][value].id
      })
    } else {
      this.setData({
        [key]: value
      })
    }
  },

  // 输入框绑定事件
  inputChange: function(e) {
    var value = e.detail.value;

    if (e.target.dataset.index != null && e.target.dataset.itemkey != null && e.target.dataset.itemkey != '') {
      var key = e.target.dataset.key + '['+ e.target.dataset.index +'].' + e.target.dataset.itemkey;
    } else {
      var key = e.target.dataset.key;
    }

    this.setData({
      [key]: value
    })
  },

  // 预设或手动输入
  yusheChange: function(e) {
    this.setData({
      ['problemList['+ e.target.dataset.index +'].yusheChecked']: e.detail.value ? 'true' : '',
      ['submitData.wenti['+ e.target.dataset.index +'].'+'yusheChecked']: e.detail.value ? 'true' : ''
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