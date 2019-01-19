const app = getApp()
const util = require('../../../utils/util.js')
var wxCharts = require('../../../utils/wxcharts.js');
Page({
  data: {
    weeklyStatisticsFun: {},
    line: []
  },
  onLoad: function(e) {
    var that = this;
    util.weeklyStatisticsFun({
      data: {},
      header: {
        'content-type': 'application/json',
        'tms-app-token': app.globalData.tmsAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {

        let data = res.data.data;
        that.setData({
          weeklyStatisticsFun: data
        });
        var allPhProfitsList = that.data.weeklyStatisticsFun.arrayList;
        if (allPhProfitsList) {
          for (var i = 0; i < allPhProfitsList.length; i++) {
            that.data.line.push('lineCanvasi' + i)
            if (allPhProfitsList[i] != '') {
              that.onReadyWxCharts(allPhProfitsList[i], i)
            }
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
  onReadyWxCharts: function(allPhProfitsListSimulationData, iNum) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData(allPhProfitsListSimulationData, iNum);

    if (iNum == 0) {
      var seriesName = "单量"
      var yAxisTitle = "单量"
    } else if (iNum == 1) {
      var seriesName = "运费"
      var yAxisTitle = "运费(元)"
    } else if (iNum == 2) {
      var seriesName = "重量"
      var yAxisTitle = "重量(千克)"
    } else if (iNum == 3) {
      var seriesName = "体积"
      var yAxisTitle = "体积(立方)"
    } else if (iNum == 4) {
      var seriesName = "库存量"
      var yAxisTitle = "库存量(件)"
    } else {
      var seriesName = "发车量"
      var yAxisTitle = "发车量(车)"
    }
    this.data.line[iNum]= new wxCharts({
      canvasId: 'lineCanvas' + iNum,
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      series: [{
        name: seriesName,
        data: simulationData.data,
        format: function(val, name) {
          if (iNum == 0) {
            if (val == '') {
              val = 0 + '单';
            } else {
              val = val + '单';
            } 
          } else if (iNum == 1) {
            if (val=='') {
              val = 0+ '元';
            } else {
              val = val + '元';
            }
          } else if (iNum == 2) {
            if (val != '') {
              val = val + '千克';
            }
          } else if (iNum == 3) {
            if (val!= '') {
              val = val + '立方';
            }
          } else if (iNum == 4) {
            if (val == '') {
              val = 0 + '件';
            } else {
              val = val + '件';
            }
          } else {
            if (val == '') {
              val = 0+ '车';
            }else{
              val = val + '车';
            }
          }
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: yAxisTitle,
        format: function(val) {
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
  createSimulationData: function(allPhProfitsListSimulationData, iNum) {
    var categories = [];
    var data = [];
    for (var i = 0; i < allPhProfitsListSimulationData.length; i++) {
      if (iNum == 0) {
        categories.push(allPhProfitsListSimulationData[i].wayData || []);
        data.push(allPhProfitsListSimulationData[i].wayNum || []);
      } else if (iNum == 1) {
        categories.push(allPhProfitsListSimulationData[i].wayData || []);
        data.push(allPhProfitsListSimulationData[i].wayTotalFee || []);
      } else if (iNum == 2) {
        categories.push(allPhProfitsListSimulationData[i].wayData || []);
        data.push(allPhProfitsListSimulationData[i].wayTotalWeight || []);
      } else if (iNum == 3) {
        categories.push(allPhProfitsListSimulationData[i].wayData || []);
        data.push(allPhProfitsListSimulationData[i].wayTotalBulk || []);
      } else if (iNum == 4) {
        categories.push(allPhProfitsListSimulationData[i].wayData || []);
        data.push(allPhProfitsListSimulationData[i].wayTotalStock || []);
      } else {
        categories.push(allPhProfitsListSimulationData[i].carLeaveTime || []);
        data.push(allPhProfitsListSimulationData[i].carNum || []);
      }
    }
    return {
      categories: categories,
      data: data
    }
  },

});