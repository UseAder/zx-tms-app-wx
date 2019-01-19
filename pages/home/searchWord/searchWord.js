const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordsXianshi:false,
    inputVal:'',
    records: [],
    pageNo: 1,
    hasMoreData: false, //上拉加载是否还存在着数据,
    carImage: "../../../images/car.png",
    backImage: "../../../images/back.png",
    back1Image: "../../../images/back1.png",
    jiantouImage: "../../../images/jiantou.png",
    scrollTopNum: 0,
  },
  /**
   * 页面相关事件处理函数--监听用户上拉加载动作
   */
  scrollReachBottom: function () {
    console.log(32132)
    if (this.data.hasMoreData) {
      
      this.loadData()
    } else {
      wx.showToast({
        title: '没有更多数据了',
        duration: 1000
      })
    }
  },
  waybillsList: function (e) {
    wx.navigateTo({
      url: '../../waybills/details/details?id=' + e.currentTarget.dataset.id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      inputVal: options.inputVal,
    })
    this.loadData()
    if(this.data.records){
      this.setData({
      inputVal: options.inputVal,
    })
    }
  },
  loadData: function () {
    var that = this;
    util.detailsOfTheWaybillFun({
      data: {
        pageNo: that.data.pageNo,
        word: that.data.inputVal
      },
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        var recordslistTem = that.data.records
        var recordslist = res.data.records
        for (var i in recordslist) {
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
  },
 
})