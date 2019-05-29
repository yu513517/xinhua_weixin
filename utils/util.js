const app = getApp()

// 默认请求地址
const baseUrl = app.globalData.baseUrl;

// 时间格式化
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 日期格式化
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

// Loading配置，请求次数统计
var needLoadingRequestCount = 0 // 声明一个变量用于存储请求个数
var loadingFactory = {
  showFullScreenLoading: function() {
    if (needLoadingRequestCount === 0) {
      wx.showLoading({
        title: 'Loading...',
        icon: 'none',
        mask: true
      })
    }

    needLoadingRequestCount++
  },

  tryHideFullScreenLoading: function() {
    if (needLoadingRequestCount <= 0) return

    needLoadingRequestCount--

    if (needLoadingRequestCount === 0) {
      wx.hideLoading()
    }
  }
}

// 封装GET/POST请求
function requestFun(url, method, data, header) {
  data = data || {}
  header = header || 'application/x-www-form-urlencoded'
  wx.showNavigationBarLoading()
  loadingFactory.showFullScreenLoading()

  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + url,
      header: {
        'content-type': header
      },
      data: data,
      method: method,
      success: function (res) {
        // if (typeof res.data === "object") {
        //   if (res.data.status) {
        //     if (res.data.status === -200) {
        //       wx.showToast({
        //         title: "为确保能向您提供最准确的服务，请退出应用重新授权",
        //         icon: "none"
        //       });
        //       reject("请重新登录");
        //     } else if (res.data.status === -201) {
        //       wx.showToast({
        //         title: res.data.msg,
        //         icon: "none"
        //       });
        //       setTimeout(function () {
        //         wx.navigateTo({
        //           url: "/pages/user/supplement/supplement"
        //         });
        //       }, 1000);
        //       reject(res.data.msg);
        //     }
        //   }
        // }
        resolve(res)
        loadingFactory.tryHideFullScreenLoading()
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 })
        loadingFactory.tryHideFullScreenLoading()
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    })
  })
  return promise;
}

// 对象转数组
function objectRetrunArray(data) {
  var newArray = []

  data.forEach(data_data => {
    var newObj = {}

    for (var i in data_data) {
      newObj[i] = data_data[i]
    }
    
    newArray.push(newObj)
  })

  return newArray
}

module.exports = {
  "get": function (url, data, header) {
    return requestFun(url, "GET", data, header);
  },
  "post": function (url, data, header) {
    return requestFun(url, "POST", data, header);
  },
  formatTime: formatTime,
  formatDate: formatDate,
  objectRetrunArray: objectRetrunArray
};