// components/site_tabbar/site_tabbar.js
Component({
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: [Number, String],
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbarList: [{
      title: '首页',
      url: '/pages/index/index',
      icon: 'cuIcon-home'
    }, {
      title: '勘查施工',
      url: '/pages/presentation_add/presentation_add',
      icon: 'cuIcon-post'
    }, {
      title: '报告管理',
      url: '/pages/presentation/presentation',
      icon: 'cuIcon-text'
    }, {
      title: '关于',
      url: '/pages/about/about',
      icon: 'cuIcon-people'
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
