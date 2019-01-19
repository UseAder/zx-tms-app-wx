const app = getApp()
const util = require('../../../utils/util.js')
Page({
  data: {
    lunbanner: "../../../images/lunbanner.png", 
    dili: "../../../images/dili.png",
    back:"../../../images/back.png",
    back1:"../../../images/back1.png",
    id:'',
    Type:'',
    vehicleDetailsFun:{}
  },
  waybillsList: function (e) {
    if (this.data.Type==1){
      wx.navigateTo({
        url: '../../waybills/details/details?id=' + e.currentTarget.dataset.id
      });
    }
   
  },
  onLoad: function (options) {
    this.data.id = options.id;
    this.data.Type = options.type;
    var that = this;
    util.vehicleDetailsFun({
      id: that.data.id,
      Type: that.data.Type,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {

        if (res.data.data) {
          let data = res.data.data;
          
          if (data.carPz) {
            if (data.carPz.leaveTime) {
              data.carPz.leaveTime = util.signTimeCalculation(data.carPz.leaveTime)
            }
            if (data.carPz.arriveTime) {
              data.carPz.arriveTime = util.signTimeCalculation(data.carPz.arriveTime)
            }
          }
          that.setData({
            vehicleDetailsFun: data
          });
        }
       
      }
    });
  }
})