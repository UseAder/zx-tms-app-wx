
const app = getApp()
const util = require('../../utils/util.js')
var wxCharts = require('../../utils/wxcharts.js');

var lineChart = null;
Page({
  data: {
    networkWdlrFun: {}
  },  
  onLoad: function (e) {
    var that = this;
    util.networkWdlrFun({
      data: {},
      header: {
        
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        let data = res.data.data;
        that.setData({
          networkWdlrFun: data
        });
        if (that.data.networkWdlrFun){
          var cartTotalProfitList = that.data.networkWdlrFun.cartTotalProfit;
          that.onReadyWxCharts(cartTotalProfitList[0], 0)
        }
       
      } 
    });
  },
  touchHandler: function (e) {
    lineChart.showToolTip(e, {

      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  }, 
  onReadyWxCharts: function (cartTotalProfitListSimulationData, iNum) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData(cartTotalProfitListSimulationData, iNum);
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      series: [{
        name: "总",
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }
      ],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '利润金额 (元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  createSimulationData: function (cartTotalProfitListSimulationData, iNum) {
    var categories = [];
    var data = [];
    for (var i = 0; i < cartTotalProfitListSimulationData.length; i++) {
        categories.push(cartTotalProfitListSimulationData[i].date || []);
        data.push(cartTotalProfitListSimulationData[i].totalProfit);
    }
    return {
      categories: categories,
      data: data
    }
  },

});