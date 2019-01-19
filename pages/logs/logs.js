//logs.js
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    technicalSupport:'技术支持：杭州领华科技有限公司',
    title:"",
    logoUrl: '../../images/logo-img.png',
    companyImg:'../../images/company.png',
    zhanghaoImg: '../../images/zhanghao.png',
    mimaImg: '../../images/mima.png',

    company: '',
    zhanghao: '',
    mima: '',
  },

  getCompanyValue: function(e) {
    this.setData({
      company: e.detail.value
    })
  },
  getZhanghaoValue: function (e) {
    this.setData({
      zhanghao: e.detail.value
    })
  },
  getMimaValue: function(e) {
    this.setData({
      mima: e.detail.value
    })
  },

  save: function() {
    var that = this;
    if (that.data.company == "") {
      wx.showToast({
        title: '公司名称不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (that.data.zhanghao == "") {
      wx.showToast({
        title: '登录账号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (that.data.mima == "") {
      wx.showToast({
        title: '登录密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    util.saveFun({
      data: {
        enterpriseCode: that.data.company,
        userName: that.data.zhanghao,
        password: that.data.mima
      },
      header: {
        'content-type': 'application/json', // 默认值
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
    
      if (res.data.code == "200") {

        wx.switchTab({
          url: '../home/home'
        });
      }else{
        wx.showToast({
          title: '账号与密码不匹配，请重新确认',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
    });
  },
  
  onLoad: function (option) {
    var that = this
    that.setData({
      title: app.globalData.displayName
    })
   
    wx.login({
      success: function(res) {
        if (res.code) {
          util.codeFun({ // 调用登录接口获取临时登录凭证（code）
              code: res.code
            
          }, function(err, res) {
            wx.setStorage({
              key: "tmsAppToken",
              data: res.data.data.token
            })
            app.globalData.tmsAppToken = res.data.data.token
            if (res.data.data.accept == true && !option.login) {
              wx.reLaunch({
                url: '../home/home',
                success: function() {
                  app.globalData.directLoginPageFlag = false
                }
              })
            }
          });
        } else {
          wx.showToast({
            title: '获取用户登录态失败！' + res.errMsg,
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }
    })
 
    wx.setNavigationBarTitle({
      title: app.globalData.displayName
    })
  }
})