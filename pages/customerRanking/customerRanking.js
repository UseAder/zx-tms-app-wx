const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    pageNo: 1,
    hasMoreData: false, //上拉加载是否还存在着数据,
    dateStart: "2015-09-01",
    dateEnd: "2019-09-01",
    rli:"../../images/rli.png",
    
    tabs: [{
        current: 1,
        name: '票数'
      },
      {
        current: 2,
        name: '运费'
      },
      {
        current:3,
        name: '重量'
      },
      {
        current:4,
        name: '体积'
      }
    ],
    activeIndex: 1,
    current:1,
    customerPhFun: {}
  },
  customerPhFun:function(){
    var that = this;
    util.customerPhFun({
      data: {
        "type": that.data.current,
        "createTimeBegin": that.data.dateStart,
        "createTimeEnd": that.data.dateEnd,
        'pageNo': that.data.pageNo,
      },
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        var recordslistTem = that.data.customerPhFun
        var recordslist = res.data.records
      
          if (that.data.pageNo == 1) {
            recordslistTem = []
          }
          if (that.data.pageNo >= res.data.totalPage) {
            that.setData({
              customerPhFun: recordslistTem.concat(recordslist),
              hasMoreData: false,
            })
          } else {
            that.setData({
              customerPhFun: recordslistTem.concat(recordslist),
              hasMoreData: true,
              pageNo: that.data.pageNo + 1,
            })
          }
        if (that.data.customerPhFun == '') {
          wx.showToast({
            title: '搜索范围内暂无数据',
            icon: 'none',
            duration: 2000
          })
        }
       
      }
    });
  },
  onLoad: function() {
    this.customerPhFun()
  },
  /**
 * 页面相关事件处理函数--监听用户上拉加载动作
 */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.customerPhFun()
    } else {
      wx.showToast({
        title: '没有更多数据了',
        duration: 1000
      })
    }
  },
  handleChange(e) { //tab部分
    this.setData({
      pageNo: 1,
      current: e.currentTarget.dataset.current,
      activeIndex: e.currentTarget.dataset.current

    });
    this.customerPhFun()
  },
  bindDateChangeStart: function (e) {
   
    this.setData({
      pageNo: 1,
      dateStart: e.detail.value
    })
    this.customerPhFun()
  },
  bindDateChangeEnd: function(e) {
    this.setData({
      pageNo: 1,
      dateEnd: e.detail.value
    })
    this.customerPhFun()
  }
})