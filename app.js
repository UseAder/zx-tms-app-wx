//app.js
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    var that = this
    wx.getStorage({
      key: 'tmsAppToken',
      success: function (res) {
        that.globalData.tmsAppToken = res.data 
      },
      fail: function () { }
    })
  },
  globalData: {
    displayName: '专线助手',//navigationBarTitleText名称
    serverUrl: 'http://10.0.0.123:8601/',//测试
    // serverUrl: 'https://zx.xcx.56linker.com/',
    tmsAppToken: '',//在token失效后调整登陆页标记，如果已跳转，其他请求在token失效时就不需要在跳转了。
    directLoginPageFlag: false,
    waybillsTabs:false
  }
})