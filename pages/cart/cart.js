const app = getApp()
const util = require('../../utils/util.js')
var wxCharts = require('../../utils/wxcharts.js');
var columnChart = null;

Page({
  data: {
    cartProfitFun: {},
  },
  onLoad: function(e) {
    var that = this;
    util.cartProfitFun({
      data: {},
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        let data = res.data.data;
        that.setData({
          cartProfitFun: data
        });
        var cartTotalProfitList = that.data.cartProfitFun.cartTotalProfit;
        for (var i = 0; i < cartTotalProfitList.length; i++) {
          if (cartTotalProfitList[i] != '') {
            that.onReadyWxCharts(cartTotalProfitList[i], i)
          }
        }
      }
    });
  },
  onReadyWxCharts: function(cartTotalProfitListSimulationData, iNum) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData(cartTotalProfitListSimulationData, iNum); //更新
    if (iNum == 0) {
      var seriesName = "总"
    } else {
      var seriesName = cartTotalProfitListSimulationData[0].endNetworkName
    }
    columnChart = new wxCharts({
      canvasId: "columnCanvas" + iNum,
      type: 'column',
      animation: true,
      categories: simulationData.categories,
      series: [{
        name: seriesName,
        data: simulationData.data,
        format: function(val, name) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        format: function(val) {
          return val + '元';
        },
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 200,
    });
  },
  createSimulationData: function(cartTotalProfitListSimulationData, iNum) {
    var categories = [];
    var data = [];
    for (var i = 0; i < cartTotalProfitListSimulationData.length; i++) {
      if (iNum == 0) {
        categories.push(cartTotalProfitListSimulationData[i].endNetworkName);
        data.push(cartTotalProfitListSimulationData[i].profitFee);
      } else {
        cartTotalProfitListSimulationData[i].leaveTime = util.signTimeCalculation(cartTotalProfitListSimulationData[i].leaveTime, true, true)
        var leaveTime = cartTotalProfitListSimulationData[i].leaveTime
        categories.push(leaveTime);
        data.push(cartTotalProfitListSimulationData[i].profitFee);
      }
    }
    return {
      categories: categories,
      data: data
    }
  }
});