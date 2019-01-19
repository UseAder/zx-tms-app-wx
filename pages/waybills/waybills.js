const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    
    carImage:"../../images/car.png",
    backImage:"../../images/back.png",
    back1Image: "../../images/back1.png",
    jiantouImage: "../../images/jiantou.png",
    scrollTopNum: 0,
    swiperWaybillsHeight:0,
    recordsListNums:0,
    c_index: 0, //当前c_index
    s3_width: 0, ////导航滚动距离
    t_width: 150, //上方每个tab的大小
    scroll_left: 0, //上方滚动的位置
    t_margin_left: 0, //上方的margin-left
    tab_tite_data: [{
      status: [],
      title: '全部'
    }, {
      status: [1],
      title: '未装车'
    }, {
      status: [10],
      title: '运输中'
    }, {
      status: [15],
      title: '已到达'
    }, {
      status: [1, 5, 10, 15, 20],
      title: '未签收'
    }, {
      status: [25],
      title: '已签收'
    }, {
      status: [100],
      title: '到站运单'
    }, {
      status: [-1],
      title: '作废'
    }],
    records: [],
    pageNo: 1,
    hasMoreData: false, //上拉加载是否还存在着数据,
    status:[],
    arriveFlag:0//到站运单
  },
  waybillsList:function(e){
    wx.navigateTo({
      url: 'details/details?id=' + e.currentTarget.dataset.id
    });
  },
  onShow: function() {
    var that = this;
    if (!app.globalData.waybillsTabs){
      that.setData({
        scrollTopNum:'0',
        status: [],
        c_index: 0, //当前c_index
        scroll_left: 0, //上方滚动的位置
      })  
    }else{
      app.globalData.waybillsTabs=false
    }
    var query = wx.createSelectorQuery();
    that.getwidth();
    that.setData({
      pageNo: 1,
    })
    that.loadData();
  },
  /**
   * 页面相关事件处理函数--监听用户上拉加载动作
   */
  scrollReachBottom: function () {
    if (this.data.hasMoreData) {
      this.loadData()
    } else {
      wx.showToast({
        title: '没有更多数据了', 
        duration: 1000
      })
    }
  },
  changeview: function(e) {
    var crash_current = e.currentTarget.dataset.current;
    var crash_status = e.currentTarget.dataset.status;
    var s = 0;
    if (crash_current != 0 && crash_current != 1 && crash_current != 2) {
      s = parseInt(crash_current - 2) * this.data.s3_width;
    }
    this.setData({
      c_index: e.currentTarget.dataset.current,
      scroll_left:s ,
      status: crash_status,
      pageNo: 1,
      scrollTopNum: 0
    });
    if (this.data.status[0] == 100) {
      this.setData({
        status: [],
        arriveFlag: 1,
      })
      this.loadData();
    } else {
      this.loadData();
    }
  },
  getwidth: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          s3_width: res.windowWidth / 5//滚动导航的个数
        })
      }
    })
  },
  loadData: function() {
    var that = this;
    util.detailsOfTheWaybillFun({
      data: {
        status: that.data.status,
        arriveFlag: that.data.arriveFlag,
        pageNo: that.data.pageNo
      },
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        that.setData({
          arriveFlag: 0,
        })
       
        var recordslistTem = that.data.records
        var recordslist = res.data.records
        for (var i in recordslist){
          if (recordslist[i].pay_type == 1) {
            recordslist[i].pay_type = '现付'
          } else if (recordslist[i].pay_type == 2) {
            recordslist[i].pay_type = '到付'
          } else if (recordslist[i].pay_type == 3) {
            recordslist[i].pay_type = '回付'
          } else if (recordslist[i].pay_type == 4) {
            recordslist[i].pay_type = '月结'
          } else if (recordslist[i].pay_type == 5) {
            recordslist[i].pay_type = '欠付'
          } else if (recordslist[i].pay_type == 6) {
            recordslist[i].pay_type = '多笔付'
          }
        }
       
        
        if (that.data.pageNo == 1) {
            recordslistTem = []
          }
        if (that.data.pageNo >= res.data.totalPage) {
          that.setData({
            records: recordslistTem.concat(recordslist),
            hasMoreData: false,
            })
        } else {
          that.setData({
              records: recordslistTem.concat(recordslist),
              hasMoreData: true,
              pageNo: that.data.pageNo + 1,
            })
          }
      }
    });
  }
})