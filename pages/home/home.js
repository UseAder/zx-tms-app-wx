
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    searchWordFun:{},
    switchTab:'switchTab',
    inputShowed: false,
    inputFocus: false,
    inputVal: "",
    dayStatistics: {
      waybillNum: 0,
      //运费
      waybillFee: 0,
      //车次
      carNum: 0,
      //库存
      waybillStock: 0
    },
    banner: "../../images/banner.png",
    BusinessFunViewData: [{
      text: '运单管理',
      img: '../../images/waybill.png',
      page:'waybills'
    }, {
      text: '网点库存',
        img: '../../images/dot.png',
        page: 'dot'
    }, {
      text: '车辆配载',
        img: '../../images/vehicle.png',
        page: 'vehicle'
    }],
    OtherFunViewData: [{
      text: '应收应付',
      img: '../../images/receivable.png',
      page: 'receivable'
    }, {
      text: '客户利润',
        img: '../../images/customerProfit.png',
        page: 'customerProfit'
    }, {
      text: '客户排行',
        img: '../../images/customerRanking.png',
        page: 'customerRanking'
    }, {
      text: '网点利润',
        img: '../../images/netProfit.png',
        page: 'netProfit'
    }, {
      text: '大车利润',
        img: '../../images/cart.png',
        page: 'cart'
    }, {
      text: '网点营业额',
        img: '../../images/dotTurnover.png',
        page: 'dotTurnover'
    }, {
      text: '发货统计',
        img: '../../images/deliverGoods.png',
        page: 'deliverGoods'
    }, {
      text: '到货统计',
    img: '../../images/deliverGoods.png',
        page: 'Arrival'
    }, {
      text: '线路利润',
    img: '../../images/line.png',
        page: 'line'
      }]
  },

  showInput: function () {
    this.setData({
      inputShowed: true,
      inputFocus: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  }, 
  clearInput: function () {
    this.setData({
      inputVal: ""
    }); 
  },
  
  searchInput:function(){
    wx.navigateTo({
      url: 'searchWord/searchWord?inputVal=' + this.data.inputVal
    });
  },

  navigatorSearchWordFun:function(){
    this.setData({
      searchWordFun: {},
      inputVal: ''
    })
  },
  inputBlur: function (e) {
    var that = this
    if (e.detail.value) {
      this.setData({
        inputVal: e.detail.value,
        inputShowed: true,
      });
    }else{
      this.setData({
        inputShowed: false,
      });
    }
    console.log(e)
    
    
  },


  onShow: function () {

    

    var that=this
    util.dayStatisticsFun({//接口名称: 当天统计
      data: {
      },
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        var Data = res.data.data
        that.setData({
          dayStatistics: Data,
        })
      }
    });
  }
})

