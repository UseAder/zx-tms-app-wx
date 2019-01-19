const app = getApp()
const util = require('../../utils/util.js')
var wxCharts = require('../../utils/wxcharts.js');
var columnChart1 = null;

Page({
  data: {
    networkSendGoodsFun: {},
  },
  onLoad: function(e) {
    var that = this;
    util.networkSendGoodsFun({
      data: {},
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        // if (res.data.data)
        let data = res.data.data;
        that.setData({
          networkSendGoodsFun: data
        });
        var allPhProfitsList = that.data.networkSendGoodsFun.allPhProfits;
        for (var i = 0; i < allPhProfitsList.length; i++) {
          if (allPhProfitsList[i] != '') {
            that.onReadyWxCharts(allPhProfitsList[i], i)
          }
        }
      }
    });
  },
  onReadyWxCharts: function(allPhProfitsListSimulationData, iNum) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData(allPhProfitsListSimulationData, iNum); //更新
    if (iNum == 0) {
      var seriesName = "总"
    } else {
      var seriesName = allPhProfitsListSimulationData[0].endNetworkName
    }
    columnChart1 = new wxCharts({
      canvasId: "columnCanvas" + iNum,
      type: 'column',
      animation: true,
      categories: simulationData.categories,
      series: [{
        name: seriesName,
        data: simulationData.data,
        format: function(val, name) {
          return val + '单';
        }
      }],
      yAxis: {
        format: function(val) {
          return val + '单';
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
  createSimulationData: function(allPhProfitsListSimulationData, iNum) {
    var categories = [];
    var data = [];
    for (var i = 0; i < allPhProfitsListSimulationData.length; i++) {
      // if (iNum == 0) {
      //   categories.push(allPhProfitsListSimulationData[i].endNetworkName || []);
      //   data.push(allPhProfitsListSimulationData[i].waybillNum);
      // } else {
        if (allPhProfitsListSimulationData[i].dayWaybill) {
          categories.push(allPhProfitsListSimulationData[i].dayWaybill);
          data.push(allPhProfitsListSimulationData[i].waybillNum);
        // }
      }
    }
    return {
      categories: categories,
      data: data
    }
  }
});