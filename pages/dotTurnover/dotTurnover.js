const app = getApp()
const util = require('../../utils/util.js')
var wxCharts = require('../../utils/wxcharts.js');
Page({
  data: {
    networkTurnoverFun: {},
    line: []
  },
  onLoad: function (e) {
    var that = this;
    util.networkTurnoverFun({
      data: {},
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        let data = res.data.data;
        that.setData({
          networkTurnoverFun: data
        });
        var allPhProfitsList = that.data.networkTurnoverFun.allPhProfits;
        for (var i = 0; i < allPhProfitsList.length; i++) {
          that.data.line.push('lineCanvasi' + i)
          if (allPhProfitsList[i] != '') {
            that.onReadyWxCharts(allPhProfitsList[i], i)
          }
        }
      }
    });
  },
  touchHandler: function (e) {
    for (var i in this.data.line) {
      if (this.data.line[i].opts) {
        if (this.data.line[i].opts.canvasId == e.target.dataset.canvasname) {
          this.data.line[i].showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
              return category + ' ' + item.name + ':' + item.data
            }
          });
        }
      }
    }
  }, 
  onReadyWxCharts: function (allPhProfitsListSimulationData, iNum) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData(allPhProfitsListSimulationData, iNum);

    if (iNum == 0) {
      var seriesName = "总"
    } else {
      var seriesName = allPhProfitsListSimulationData[0].endNetworkName
    }
    this.data.line[iNum] = new wxCharts({
      canvasId: 'lineCanvas' + iNum,
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      series: [{
        name: seriesName,
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

  createSimulationData: function (allPhProfitsListSimulationData, iNum) {
    var categories = [];
    var data = [];
    for (var i = 0; i < allPhProfitsListSimulationData.length; i++) {
      
        if (allPhProfitsListSimulationData[i].dayWaybill) {
          categories.push(allPhProfitsListSimulationData[i].dayWaybill);
          data.push(allPhProfitsListSimulationData[i].totalProfitFee);
        }
      
    }
    return {
      categories: categories,
      data: data
    }
  },

});