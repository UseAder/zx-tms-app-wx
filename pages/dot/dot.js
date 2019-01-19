const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    backImage: "../../images/back.png",
    back1Image: "../../images/back1.png",
    storeSummaryFun: {
      storeReceive: {},
      storeSend: {},

    }, //网点库存
    pageNo: 1,
    hasMoreData: false, //上拉加载是否还存在着数据,
    storeListFun: {}, //网点库存列表
    records: {},
    tabs: [{
        status: 1,
        name: '发货库存'
      },
      {
        status: 2,
        name: '到货库存'
      }
    ],
    activeIndex: 1,
  },
  handleChange(e) { //tab部分
    this.setData({
      pageNo: 1,
      satues: e.currentTarget.dataset.status,
      activeIndex: e.currentTarget.dataset.status

    });
    this.storeListFun();
  },

  storeListFun: function() {
    var that = this;
    util.storeListFun({
      data: {
        "queryType": that.data.activeIndex,
        "pageNo": that.data.pageNo
      },
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {

        if (res.data.records) {
          let data = res.data.records;
          for (var i in data) {
            if (data[i].billTime) {
              data[i].billTime = util.signTimeCalculation(data[i].billTime)
            }
          }
          var recordslistTem = that.data.storeListFun
          var recordslist = res.data.records
          if (that.data.pageNo == 1) {
            recordslistTem = []
          }
          if (that.data.pageNo >= res.data.totalPage) {
            that.setData({
              storeListFun: recordslistTem.concat(recordslist),
              hasMoreData: false,
            })
          } else {
            that.setData({
              storeListFun: recordslistTem.concat(recordslist),
              hasMoreData: true,
              pageNo: that.data.pageNo + 1,
            })
          }
        }
      }
    });
  },

  onReachBottom: function() {
    if (this.data.hasMoreData) {
      this.storeListFun()
    } else {
      wx.showToast({
        title: '没有更多数据了',
        duration: 1000
      })
    }
  },
  onLoad: function(options) {
    var that = this;
    util.storeSummaryFun({
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        let data = res.data.data;
        that.setData({
          storeSummaryFun: data
        });
      }
    });

    that.storeListFun();
  }
})