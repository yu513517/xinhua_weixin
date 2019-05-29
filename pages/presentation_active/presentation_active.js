const app = new getApp()
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal_name     : null,                                 // 弹出框名称，修复遮盖下拉框bug
    jingling       : wx.getStorageSync('loginJingling'),   // 获取秘钥
    presentation_id: '',                                   // 需要修改的文章id

    selects_region   : [],   // 检测区域默认数据
    selects_preset   : [],   // 内置预设默认数据
    selects_risk     : [
      {
        id   : 0,
        title: '低'
      },
      {
        id   : 1,
        title: '中'
      },
      {
        id   : 2,
        title: '高'
      }
    ],
    
    showData: {
      inspect_purpose  : [],   // 检查目的
      inspect_way      : [],   // 检查方法
      inspect_equipment: [],   // 检查设备
      scene            : [],   // 现场情况
      scene_problems   : [
        {
          scene_photo         : '',   // 现场照片
          risk_level          : [],   // 风险等级
          risk_level_index    : 0,    // 风险等级index
          inspect_region      : [],   // 检查区域
          inspect_region_index: 0,    // 检查区域index
          preset              : [],   // 内置预设
          canDel              : true  // 是否显示删除按钮
        }
      ]
    },
    
    submitData: {
      latitude         : '',   // 维度
      longitude        : '',   // 经度
      survey_name      : '',   // 勘察人员
      survey_date      : '',   // 勘察日期
      customer_name    : '',   // 客户名称
      customer_address : '',   // 客户地址
      inspect_purpose  : [],   // 检查目的
      inspect_way      : [],   // 检查方法
      inspect_equipment: [],   // 检查设备
      scene            : [],   // 现场情况
      remarks          : '',   // 内部备注
      scene_problems   : [
        {
          scene_photo            : '',     // 现场照片
          risk_level             : 0,      // 风险等级
          inspect_region         : 0,      // 检查区域
          preset_switch          : true,   // 内置预设 OR 手动输入
          preset                 : [],     // 内置预设
          existing_problems      : '',     // 存在问题
          improvement_suggestions: ''      // 改进意见
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this

    // 设置文章id
    this.setData({
      presentation_id: options.id ? options.id : ''
    })

    // 初始化数据
    util.post('wxHelper/baogaoYs.php', { jingling: this.data.jingling }).then(res => {
      // 初始化下拉菜单数据
      _this.setData({
        selects_region                               : res.data.jianchaquyu,
        selects_preset                               : res.data.jianchayushe,
        ['showData.inspect_purpose']                 : util.objectRetrunArray(res.data.jianchamudi),
        ['showData.inspect_way']                     : util.objectRetrunArray(res.data.jianchafangfa),
        ['showData.inspect_equipment']               : util.objectRetrunArray(res.data.jianchashebei),
        ['showData.scene']                           : util.objectRetrunArray(res.data.xianchangkancha),
        ['showData.scene_problems[0].risk_level']    : util.objectRetrunArray(_this.data.selects_risk),
        ['showData.scene_problems[0].inspect_region']: util.objectRetrunArray(res.data.jianchaquyu),
        ['showData.scene_problems[0].preset']        : util.objectRetrunArray(res.data.jianchayushe)
      })

      // 判断是否为修改页面，初始化页面显示数据
      if(this.data.presentation_id != '') {
        // 拉取修改的数据
        util.post('wxHelper/baogaoupYs.php', { jingling: this.data.jingling, code: options.id }).then(default_res => {
          // console.log(default_res)

          // 勾选检查目的
          _this.data.showData.inspect_purpose.forEach(select_item => {
            // 先初始化选中状态
            select_item.isChecked = false

            default_res.data.jianchamudi.forEach(item => {
              if (select_item.id == item) {
                select_item.isChecked = true
              }
            })
          })

          // 勾选检查方法
          _this.data.showData.inspect_way.forEach(select_item => {
            // 先初始化选中状态
            select_item.isChecked = false

            default_res.data.jianchafangfa.forEach(item => {
              if (select_item.id == item) {
                select_item.isChecked = true
              }
            })
          })

          // 勾选检查设备
          _this.data.showData.inspect_equipment.forEach(select_item => {
            // 先初始化选中状态
            select_item.isChecked = false

            default_res.data.jianchashebei.forEach(item => {
              if (select_item.id == item) {
                select_item.isChecked = true
              }
            })
          })

          // 勾选现场情况
          _this.data.showData.scene.forEach(select_item => {
            // 先初始化选中状态
            select_item.isChecked = false

            default_res.data.xianchangqingkuang.forEach(item => {
              if (select_item.id == item) {
                select_item.isChecked = true
              }
            })
          })

          _this.data.showData.scene_problems   = []  // 清空显示原始数据
          _this.data.submitData.scene_problems = []  // 清空提交原始数据
          // 现场问题赋值
          default_res.data.wenti.forEach((item, index) => {
            // 新建变量，防止之后改变原数据
            var risk_level           = util.objectRetrunArray(_this.data.selects_risk)
            var risk_level_index     = 0
            var inspect_region       = util.objectRetrunArray(_this.data.selects_region)
            var inspect_region_index = 0
            var preset               = util.objectRetrunArray(_this.data.selects_preset)

            // 风险等级赋值
            risk_level.forEach((risk_item, risk_index) => {
              risk_item.isChecked = false
              if (risk_item.id == item.fengxiandengji) {
                risk_level_index    = risk_index
                risk_item.isChecked = true
              }
            })

            // 检查区域赋值
            inspect_region.forEach((region_item, region_index) => {
              region_item.isChecked = false
              if (region_item.id == item.jianchaquyu) {
                inspect_region_index  = region_index
                region_item.isChecked = true
              }
            })

            // 内置预设赋值
            preset.forEach(preset_item => {
              preset_item.isChecked = false

              item.yusheid.forEach(item => {
                if (preset_item.id == item) {
                  preset_item.isChecked = true
                }
              })
            })

            // 如果有上传图片则增加默认图片服务器地址，没有则保持原值
            item.img_address = item.img_address ? app.globalData.baseUrl + item.img_address : ''
            // 是否开启删除按钮
            var canDel = index == 0 ? false : true
            _this.data.showData.scene_problems.unshift({
              scene_photo         : item.img_address,       // 现场照片
              risk_level          : risk_level,             // 风险等级
              risk_level_index    : risk_level_index,       // 风险等级index
              inspect_region      : inspect_region,         // 检查区域
              inspect_region_index: inspect_region_index,   // 检查区域index
              preset              : preset,                 // 内置预设
              canDel              : canDel                  // 是否显示删除按钮
            })

            _this.data.submitData.scene_problems.unshift({
              id                     : item.id,                       // 问题ID
              scene_photo            : item.img_address,              // 现场照片
              risk_level             : Number(item.fengxiandengji),   // 风险等级
              inspect_region         : Number(item.jianchaquyu),      // 检查区域
              preset_switch          : Boolean(item.yushe),           // 内置预设 OR 手动输入
              preset                 : item.yusheid,                  // 内置预设
              existing_problems      : item.cunzaiwenti,              // 存在问题
              improvement_suggestions: item.gaijinyijian              // 改进意见
            })
          })

          _this.setData({
            ddid                            : default_res.data.ddid,
            ['submitData.survey_name']      : default_res.data.kanchayuan,
            ['submitData.survey_date']      : default_res.data.kanchariqi,
            ['submitData.customer_name']    : default_res.data.kehuname,
            ['submitData.customer_address'] : default_res.data.address,
            ['submitData.remarks']          : default_res.data.beizhu,
            ['submitData.inspect_purpose']  : default_res.data.jianchamudi,
            ['submitData.inspect_way']      : default_res.data.jianchafangfa,
            ['submitData.inspect_equipment']: default_res.data.jianchashebei,
            ['submitData.scene']            : default_res.data.xianchangqingkuang,
            ['submitData.scene_problems']   : _this.data.submitData.scene_problems,
            ['showData.inspect_purpose']    : _this.data.showData.inspect_purpose,
            ['showData.inspect_way']        : _this.data.showData.inspect_way,
            ['showData.inspect_equipment']  : _this.data.showData.inspect_equipment,
            ['showData.scene']              : _this.data.showData.scene,
            ['showData.scene_problems']     : _this.data.showData.scene_problems
          })
        })
      } else {
        _this.setData({
          ['submitData.survey_date']: util.formatDate(new Date())
        })
      }

      // console.log(_this.data)
    })
  },

  // 选择现场照片
  chooseScenePhotos: function (e) {
    var _this = this
    var index = e.target.dataset.index

    wx.chooseImage({
      conunt: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
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
          success: function (res) {
            _this.setData({
              ['showData.scene_problems[' + index + '].scene_photo']: tempFilePaths[0],
              ['submitData.scene_problems[' + index + '].scene_photo']: res.data
            })
            wx.hideToast()
          },
          fail: function (res) {
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

  // 获取用户当前位置
  getUserLocation: function (e) {
    var _this = this

    wx.showLoading({
      title: '获取位置中...'
    })

    wx.chooseLocation({
      type: 'wgs84',
      success(res) {
        _this.setData({
          ['submitData.latitude']        : res.latitude,
          ['submitData.longitude']       : res.longitude,
          ['submitData.customer_address']: res.address
        })
        wx.hideLoading()
      },
      fail() {
        wx.hideLoading()
      }
    })
  },

  // 输入框绑定事件
  inputChange: function(e) {
    var value   = e.detail.value            // 输入的文字
    var index   = e.target.dataset.index    // 对应的二维数组的index
    var itemkey = e.target.dataset.itemkey  // 对应的二维数组的键值

    if (index == undefined || itemkey == undefined) {
      var key = 'submitData.' + e.target.dataset.key
    } else {
      var key = 'submitData.' + e.target.dataset.key + '[' + index + '].' + itemkey
    }

    this.setData({
      [key]: value
    })
  },

  // 单/多选绑定事件
  selectorChange: function(e) {
    var isdata         = (e.target.dataset.isdate == 'true') ? true : false       // 是否为日期类型
    var ismultiple     = (e.target.dataset.ismultiple == 'false') ? false : true  // 是否为多选
    var value          = e.detail.value                                           // 最终选择的值，多选时为['id, index']的集合
    var multiple_id    = []                                                       // 用于储存id的集合
    var multiple_index = []                                                       // 用于储存index的集合
    var key            = e.target.dataset.key                                     // data中的键值
    var keyindex       = e.target.dataset.keyindex                                // 二维数组的index
    var itemkey        = e.target.dataset.itemkey                                 // 二维数组中的子键值

    // 日期类型
    if (isdata) {
      this.setData({
        ['submitData.' + key]: value
      })
    } else {
      // 多选操作
      if (ismultiple) {
        // 拆分id和index，分别添加到各自的数组中
        for (var value_i in value) {
          multiple_id.push(value[value_i].split(',')[0])
          multiple_index.push(value[value_i].split(',')[1])
        }
        
        if (keyindex == undefined || itemkey == undefined) {
          // 重置显示数据选中项
          this.data['showData'][key].forEach((showData, index) => {
            showData.isChecked = false
            this.setData({
              ['showData.' + key + '[' + index + ']']: showData
            })
          })

          // 记录当前选择的项
          multiple_index.forEach(index => {
            this.setData({
              ['showData.' + key + '[' + index + '].isChecked']: true
            })
          })

          // 添加id到最终提交表单的数组中
          this.setData({
            ['submitData.' + key]: multiple_id
          })
        } else {
          // 重置显示数据选中项
          this.data['showData'][key][keyindex][itemkey].forEach((showData, index) => {
            showData.isChecked = false
            this.setData({
              ['showData.' + key + '[' + keyindex + '].'+ itemkey +'[' + index + ']']: showData
            })
          })

          // 记录当前选择的项
          multiple_index.forEach(index => {
            this.setData({
              ['showData.' + key + '[' + keyindex + '].'+ itemkey +'[' + index + '].isChecked']: true
            })
          })

          // 添加id到最终提交表单的数组中
          this.setData({
            ['submitData.' + key + '[' + keyindex + '].'+ itemkey]: multiple_id
          })
        }
      } else { // 单选操作
        if (keyindex !== '' && itemkey !== null && itemkey !== '') {
          // 设置选中的index，提交数据中的id
          this.setData({
            ['showData.' + key + '[' + keyindex + '].'+ itemkey +'_index']: Number(value),
            ['submitData.' + key + '[' + keyindex + '].'+ itemkey]: this.data['showData'][key][keyindex][itemkey][value].id
          })
        } else {
          // 设置选中的index，提交数据中的id
          this.setData({
            ['showData.' + key + '_value[' + index + ']']: Number(value),
            ['submitData.' + key]: this.data['showData'][key][value].id
          })
        }
      }
    }

    // console.log(this.data)
  },

  // 新增问题
  newProblems: function() {
    var show_scene_problems = {
      scene_photo         : '',                                                 // 现场照片
      risk_level          : util.objectRetrunArray(this.data.selects_risk),     // 风险等级
      risk_level_index    : 0,                                                  // 风险等级index
      inspect_region      : util.objectRetrunArray(this.data.selects_region),   // 检查区域
      inspect_region_index: 0,                                                  // 检查区域index
      preset              : util.objectRetrunArray(this.data.selects_preset),   // 内置预设
      canDel              : false                                               // 是否显示删除按钮
    }

    var submit_scene_problems = {
      scene_photo            : '',     // 现场照片
      risk_level             : 0,      // 风险等级
      inspect_region         : 0,      // 检查区域
      preset_switch          : true,   // 内置预设 OR 手动输入
      preset                 : [],     // 内置预设
      existing_problems      : '',     // 存在问题
      improvement_suggestions: ''      // 改进意见
    }

    // 新增数据，更新data
    this.data.showData.scene_problems.push(show_scene_problems)
    this.data.submitData.scene_problems.push(submit_scene_problems)
    this.setData({
      ['showData.scene_problems']: this.data.showData.scene_problems,
      ['submitData.scene_problems']: this.data.submitData.scene_problems
    })

    // console.log(this.data)
  },

  // 删除问题
  delProblems: function(e) {
    this.data.showData.scene_problems.splice(e.target.dataset.index, 1)
    this.data.submitData.scene_problems.splice(e.target.dataset.index, 1)
    this.setData({
      ['showData.scene_problems']: this.data.showData.scene_problems,
      ['submitData.scene_problems']: this.data.submitData.scene_problems
    })
  },

  // 确定提交
  submitPresentation: function() {
    if (this.data.presentation_id == '') {
      util.get('wxHelper/baogaoAdd.php', { jingling: this.data.jingling, dates: this.data.submitData }).then(res => {
        wx.showToast({
          title: '添加成功',
          mask: true,
          success: function () {
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/presentation/presentation'
              })
            }, 2000)
          }
        })
      })
    } else {
      util.get('wxHelper/baogaoUP.php', { jingling: this.data.jingling, dates: this.data.submitData }).then(res => {
        wx.showToast({
          title: '修改成功',
          mask: true,
          success: function () {
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/presentation/presentation'
              })
            }, 2000)
          }
        })
      })
    }
  },

  // 预设或手动输入
  presetSwitch: function(e) {
    this.setData({
      ['showData.scene_problems[' + e.target.dataset.index + '].preset_switch']       : e.detail.value ? true: false,
      ['submitData.scene_problems[' + e.target.dataset.index + '].' + 'preset_switch']: e.detail.value ? true: false
    })
  },

  // 显示弹出框
  showModal: function (e) {
    this.setData({
      modal_name: e.currentTarget.dataset.target
    })
  },

  // 隐藏弹出框
  hideModal: function (e) {
    this.setData({
      modal_name: null
    })
  }

})
