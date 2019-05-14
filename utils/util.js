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

// loading配置，请求次数统计
function startLoading() {
  wx.showLoading({
    title: 'Loading...',
    icon: 'none',
    mask: true
  })
}
function endLoading() {
  wx.hideLoading();
}
// 声明一个对象用于存储请求个数
var needLoadingRequestCount = 0;
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
};
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
};

// 封装GET/POST请求
function requestFun(url, method, data, header) {
  data = data || {};
  header = header || 'application/x-www-form-urlencoded';
  wx.showNavigationBarLoading();
  showFullScreenLoading();

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
        resolve(res);
        tryHideFullScreenLoading();
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 });
        tryHideFullScreenLoading();
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    });
  });
  return promise;
}

module.exports = {
  "get": function (url, data, header) {
    return requestFun(url, "GET", data, header);
  },
  "post": function (url, data, header) {
    return requestFun(url, "POST", data, header);
  },
  formatTime: formatTime,
  formatDate: formatDate
};