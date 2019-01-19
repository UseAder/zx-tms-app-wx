const app = getApp()
var util = require('../../../utils/util.js')
Page({
  data: {
    id:'',
    returnPic: [],//运单详情-回单 图片集合 
    abnormalPic: [],//运单详情-异常 图片集合 
    instorePic: [],
    
    wenhaoImage: '../../../images/wenhao.png',
    abnormalImage: '../../../images/zhuyi.png',
    receipPhotoListabImage: '../../../images/gengduo.png',
    c_index: 0, //当前
    s3_width: 0, ////导航滚动距离
    t_width: 150, //上方每个tab的大小
    scroll_left: 0, //上方滚动的位置
    t_margin_left: 0, //上方的margin-left
    retutnBlickN: false,
    tab_tite_data: [{
      status: 1,
      title: '运单',
      color: "orange",
      page: ' <include src="waybill/waybill.wxml"/>'
    }, {
      status: 2,
      title: '成本',
      color: "blue"
    }, {
      status: 3,
      title: '运输',
      color: "green"
    }, {
      status: 4,
      title: '跟踪',
      color: "yellow"
    }, {
      status: 5,
      title: '回单',
      color: "black"
    }, {
      status: 6,
      title: '异常',
      color: "pink"
    }, {
      status: 7,
      title: '改单',
      color: "#454354"
    }, {
      status: 8,
      title: '进仓',
      color: "#986667"
    }, {
      status: 9,
      title: '货款',
      color: "#454354"
    }, {
      status: 10,
      title: '结算',
      color: "#986667"
    }, {
      status: 11,
      title: '短信',
      color: "#986667"
    }],
    waybillDetailsFun: {}, //运单
    waybillCostFun: {}, // 成本
    waybillTransportFun: {
      deliver: {},
      pick: {},
      sign: {},
      stowage: {}
    }, //运输
    waybillTrackFun: {}, //跟踪
    waybillReceiptFun: {}, //回单
    waybillAbnormalFun: {}, //异常
    waybillChangelistFun: {}, //改单
    waybillWarehouseFun: {}, //进仓
    waybillPaymentFun: {}, //货款
    waybillSettlementFun: {}, //结算
    waybillSmsFun: {} //短信

  },

  onShow: function() {
    this.getwidth();
  },
  picUpdateFun: function (filePath) {
    var that = this;
    util.picUpdateFun({
      data: {
        AddFileRequest:{
          type:4,
          name: 'xxx.Png',
          url: 'http://tmp/wx48ed19d9599ab7d3.o6zAJsxHIbtlbM1zFEJhDVYXWj9U.HMsV5Z3PuJzO548dff0018814e016af84bce8b7b5f5c.jpg',
            size:4354
        }
        
      },
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {

      }
    });
  },

  returnPicViewImage: function (e) { //回单查看照片
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.returnPic // 需要预览的图片http链接列表
    })
  }, 
  abnormalPicViewImage: function (e) { //异常查看照片
  
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.abnormalPic // 需要预览的图片http链接列表
    })
  },
  instorePicPreviewImage: function (e) { //上传照片
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.instorePic // 需要预览的图片http链接列表
    })
  }, 
  
  retutnBlickNone: function() {
    this.setData({
      retutnBlickN: !this.data.retutnBlickN
    });
  },
  //滑
  get_index: function(e) {
    var crash_current = e.detail.current;
    var s = 0;
    if (crash_current != 0 && crash_current != 1 && crash_current != 2) {
      s = parseInt(crash_current - 2) * this.data.s3_width;
    }
    this.setData({
      c_index: e.detail.current,
      scroll_left: s
    });
  },
  //点
  changeview: function(e) {
    var crash_current = e.currentTarget.dataset.current;
    var s = 0;
    if (crash_current != 0 && crash_current != 1 && crash_current != 2) {
      s = parseInt(crash_current - 2) * this.data.s3_width;
    }
    this.setData({
      c_index: e.currentTarget.dataset.current,
      scroll_left: s
    });
  },
  wenhaoImageFun:function(){
    this.setData({
      c_index: 0
    });
  },
  getwidth: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          s3_width: res.windowWidth / 5,
          clientHeight: res.windowHeight * 2
        });

      },
    })
  },
  onLoad: function(options) {
    this.data.id = options.id;
    var that = this;
    app.globalData.waybillsTabs = true
    util.waybillDetailsFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data) {
          let data = res.data.data;
          if (data.billTime) {
            data.billTime = util.signTimeCalculation(data.billTime)
          }
          if (data.payType == 1) {
            data.payType = '现付'
          } else if (data.payType == 2) {
            data.payType = '到付'
          } else if (data.payType == 3) {
            data.payType = '回付'
          } else if (data.payType == 4) {
            data.payType = '月结'
          } else if (data.payType == 5) {
            data.payType = '欠付'
          } else if (data.payType == 6) {
            data.payType = '多笔付'
          }
          if (data.deliveryType == 1) {
            data.deliveryType = '自提'
          } else if (data.deliveryType == 2) {
            data.deliveryType = '送货'
          }
          that.setData({
            waybillDetailsFun: data
          });
        }
      }
    });

    util.waybillCostFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data) {
          let data = res.data.data;
          that.setData({
            waybillCostFun: data
          });
        }
      }
      }); 
    util.waybillTransportFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data) {
          let data = res.data.data;
          if (data.pick) {
            if (data.pick.pickTime) {
              data.pick.pickTime = util.signTimeCalculation(data.pick.pickTime)
            }
            if (data.pick.pickDoneTime) {
              data.pick.pickDoneTime = util.signTimeCalculation(data.pick.pickDoneTime)
            }
          }
          if (data.stowage) {
            if (data.stowage.leaveTime) {
              data.stowage.leaveTime = util.signTimeCalculation(data.stowage.leaveTime)
            }
            if (data.stowage.arriveTime) {
              data.stowage.arriveTime = util.signTimeCalculation(data.stowage.arriveTime)
            }
          }
          if (data.deliver) {
            if (data.deliver.deliverTime) {
              data.deliver.deliverTime = util.signTimeCalculation(data.deliver.deliverTime)
            }
            if (data.deliver.deliverDoneTime) {
              data.deliver.deliverDoneTime = util.signTimeCalculation(data.deliver.deliverDoneTime)
            }
          }
          if (data.sign) {
            if (data.sign.signTime) {
              data.sign.signTime = util.signTimeCalculation(data.sign.signTime)
            }
          }
          that.setData({
            waybillTransportFun: data
          });
        }
      }
    });
    util.waybillTrackFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data) {
          let data = res.data.data;
          let yueRe = true
          for (var i in data) {
            data[i].trackTime = util.signTimeCalculation(data[i].trackTime, yueRe)
          }

          that.setData({
            waybillTrackFun: data
          });
        }
      }
    });

    util.waybillReceiptFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data) {
          let yueRe = true
          if (res.data.data.receiptList) {
            for (var i in res.data.data.receiptList) {
              res.data.data.receiptList[i].createTime = util.signTimeCalculation(res.data.data.receiptList[i].createTime, yueRe)
            }
          }
          let data = res.data.data;
          that.setData({
            waybillReceiptFun: data
          });
          if (data.photoList != '') {
            for (var i in data.photoList) {
              that.data.returnPic.push(data.photoList[i].url)
            }
          }
        }

      }
    });
    util.waybillAbnormalFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data) {
          let data = res.data.data;
          that.setData({
            waybillAbnormalFun: data
          });
          if (data.photoList!=''){
            for (var i in data.photoList) {
              that.data.abnormalPic.push(data.photoList[i].url)
            }
          }
        }
      }
    });
    util.waybillChangelistFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data) {
          let data = res.data.data;

          for (var i in data) {
            data[i].createTime = util.signTimeCalculation(data[i].createTime)
            data[i].auditTime = util.signTimeCalculation(data[i].auditTime)
          }

          that.setData({
            waybillChangelistFun: data
          });
         
        }
      }
    });
    util.waybillWarehouseFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data) {
          let data = res.data.data;
          if (data.store) {
            for (var i in data.store) {
              data.store.storeTime = util.signTimeCalculation(data.store.storeTime)
            }
            that.setData({
              waybillWarehouseFun: data
            });
            if (data.photoList != '') {
              for (var i in data.photoList) {
                that.data.instorePic.push(data.photoList[i].url)
              }
            }
          }
        }
      }
    });

    util.waybillPaymentFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        let data = res.data.data;
        that.setData({
          waybillPaymentFun: data
        });
      }
    });
    util.waybillSettlementFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data[0]) {
          let data = res.data.data[0];

          that.setData({
            waybillSettlementFun: data
          });
        }
      }
    });
    util.waybillSmsFun({
      waybillId: that.data.id,
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.data) {
          let data = res.data.data;
          for (var i in data) {
            data[i].sendTime = util.signTimeCalculation(data[i].sendTime)
          }
          that.setData({
            waybillSmsFun: data
          })
        }
      }
    });
  }
})