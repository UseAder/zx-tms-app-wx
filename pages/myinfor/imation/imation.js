const app = getApp()
const util = require('../../../utils/util.js')
var lineChart = null;
Page({
  data: {
    selfMessage: {}
  },
  onLoad: function (e) {
    var that = this;
    util.selfMessage({
      data: {},
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        let data = res.data.data;
       
        if (data.registerTime) {
          data.registerTime = util.signTimeCalculation(data.registerTime)
        }
        if (data.openTime) {
          data.openTime = util.signTimeCalculation(data.openTime)
        }
        if (data.expireEndTime) {
          data.expireEndTime = util.signTimeCalculation(data.expireEndTime)
        }
        that.setData({
          selfMessage: data
        })
      }
    });
  }

});