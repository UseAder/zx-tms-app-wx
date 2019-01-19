const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    kehu: "../../images/kehu.png",
    customerKhphSfFun: {},
  },
  onLoad: function() {
    var that = this;
    util.customerKhphSfFun({
      data: {},
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.records) {
          let data = res.data.records;
          that.setData({
            customerKhphSfFun: data
          });
        }
      }
    });
  }
})