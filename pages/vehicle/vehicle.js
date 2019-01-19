const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    vehicleList:{},
    carSummaryFun: {
      storeReceive: {},
      storeSend: {}
    }, //网点库存
    pageNo: 1,
    hasMoreData: false, //上拉加载是否还存在着数据,
    storeListFun: {}, //网点库存列表
    records: {},
    tabs: [{
      status: 1,
      name: '配载发货'
    },
    {
      status: 2,
      name: '配载到站'
    }],
    activeIndex: 1,
    status:1,
    stowageId:''
  },
  vehicleDetailsWxml(e) {
    wx.navigateTo({
      url: 'vehicleDetails/vehicleDetails?id=' + e.currentTarget.dataset.id + '&type=' + this.data.status
    });
  },

  handleChange(e) { //tab部分
  var that=this
    that.setData({
      pageNo: 1,
      activeIndex: e.currentTarget.dataset.status
    });
    if (that.data.activeIndex==1){
      that.carSendArriveFun();
      that.setData({
        status:1,
      });
    }else{
      that.carArriveManagerFun();
      that.setData({
        status: 2,
      });
    }
  }, 
  carDepart(e) {
    wx.showModal({
      title: '提示',
      content: '是否确定发车',
      success: function (res) {
        if (res.confirm) {
          var that = this;
          let stowageId = e.currentTarget.dataset.id; //获取点击的下拉列表的下标
          util.carDepartFun({
            stowageId: stowageId,
            header: {
              'content-type': 'application/json',
              'tms-app-token': app.globalData.tmsAppToken
            }
          }, function (err, res) {
            if (res.data.code == "200") {
              wx.showToast({
                title: '已确认到站', success: res => {
                  var pages = getCurrentPages();//得到当前所有的页面
                  if (pages.length > 1) {
                    var prePage = pages[pages.length - 1];//-1的话就是当前页
                    //然后，prePage就是上一页，就可以prePage.xxx()来加载某个方法
                    //prePage.setData({}) 就是设置值了，
                    //比如这样
                    prePage.setData({
                      vehicleList: [],
                      "pageNo": 1
                    })
                    prePage.carSendArriveFun();
                    //这里是先将上一页的chatList清空，然后再加载一次getHistoryList这个方法
                  }
                }
              })
            }
          });
        } else if (res.cancel) {
          
        }
      }
    })
  },
  carArrive(e) {
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否确定到站',
      success: function (res) {
        if (res.confirm) {
          let stowageId = e.currentTarget.dataset.id; //获取点击的下拉列表的下标
          util.carArriveFun({
            stowageId: stowageId
            ,
            header: {
              'content-type': 'application/json',
              'tms-app-token': app.globalData.tmsAppToken
            }
          }, function (err, res) {
            if (res.data.code == "200") {
              wx.showToast({
                title: '已确认到站', success: res => {
                  var pages = getCurrentPages();//得到当前所有的页面
                  if (pages.length > 1) {
                    var prePage = pages[pages.length - 1];//-1的话就是当前页
                    prePage.setData({
                      vehicleList: [],
                      "pageNo": 1
                    })
                    if (that.data.activeIndex == 1) {
                      prePage.carSendArriveFun();
                      that.setData({
                        status: 1,
                      });
                    } else {
                      prePage.carArriveManagerFun();
                      that.setData({
                        status: 2,
                      });
                    }
                  }
                }
              })
            }
          });
        } else if (res.cancel) {
        }
      }
    })
    
  },
  carSendArriveFun: function () {
    var that = this;
    util.carSendArriveFun({
      data:{
        "pageNo": that.data.pageNo
      },
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        if (res.data.records) {
          let data = res.data.records;
          for (var i in data) {
            if (data[i].leaveTime) {
              data[i].leaveTime = util.signTimeCalculation(data[i].leaveTime)
            }
          }
          var recordslistTem = that.data.vehicleList
          var recordslist = res.data.records
          if (that.data.pageNo == 1) {
            recordslistTem = []
          }
          if (that.data.pageNo >= res.data.totalPage) {
            that.setData({
              vehicleList: recordslistTem.concat(recordslist),
              hasMoreData: false,
            })
          } else {
            that.setData({
              vehicleList: recordslistTem.concat(recordslist),
              hasMoreData: true,
              pageNo: that.data.pageNo + 1,
            })
          }
        }
      }
    });

  },
  carArriveManagerFun: function () {
    var that = this;
    util.carArriveManagerFun({
      data: {
        "pageNo": that.data.pageNo
      },
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {

        if (res.data.records) {
          let data = res.data.records;
          for (var i in data) {
            if (data[i].leaveTime) {
              data[i].leaveTime = util.signTimeCalculation(data[i].leaveTime)
            }
          }
          var recordslistTem = that.data.vehicleList
          var recordslist = res.data.records
          if (that.data.pageNo == 1) {
            recordslistTem = []
          }
          if (that.data.pageNo >= res.data.totalPage) {
            that.setData({
              vehicleList: recordslistTem.concat(recordslist),
              hasMoreData: false,
            })
          } else {
            that.setData({
              vehicleList: recordslistTem.concat(recordslist),
              hasMoreData: true,
              pageNo: that.data.pageNo + 1,
            })
          }
        }
      }
    });

  },

  onReachBottom: function () {
    var that=this;
    if (that.data.hasMoreData) {
      if (that.data.activeIndex == 1) {
        that.carSendArriveFun();
        that.setData({
          status: 1,
        });
      } else {
        that.carArriveManagerFun();
        that.setData({
          status: 2,
        });
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
        duration: 1000
      })
    }
  },

  onLoad:function(){
    var that = this;
    util.carSummaryFun({
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        let data = res.data.data;
        that.setData({
          carSummaryFun: data
        });
      }
    });
    if (that.data.activeIndex == 1) {
      that.carSendArriveFun();
      that.setData({
        status: 1,
      });
    } else {
      that.carArriveManagerFun();
      that.setData({
        status: 2,
      });
    }
  }
})