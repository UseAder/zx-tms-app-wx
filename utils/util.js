const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function signTimeCalculation(Time, yueRe,nianYue) {
  var d = new Date(Time);
  var mydate = d.getDate();
  var mymonth = d.getMonth() + 1;
  var gethours = d.getHours();
  var getminutes = d.getMinutes();
  var getseconds = d.getSeconds();
  if (d.getDate() < 10) {
    mydate = '0' + d.getDate(); //补齐
  }
  if (d.getMonth() < 9) {
    mymonth = '0' + mymonth; //补齐
  }
  if (d.getHours() < 10) {
    gethours = '0' + gethours; //补齐
  }
  if (d.getMinutes() < 10) {
    getminutes = '0' + getminutes; //补齐
  }
  if (d.getSeconds() < 10) {
    getseconds = '0' + getseconds; //补齐
  }
  if (yueRe && !nianYue) {
    return (mymonth) + '-' + mydate + ' ' + gethours + ':' + getminutes
  } else if (yueRe && nianYue){
    return d.getFullYear() + '-' + (mymonth) + '-' + mydate 
  }
  
  else {
    return d.getFullYear() + '-' + (mymonth) + '-' + mydate + ' ' + gethours + ':' + getminutes + ':' + getseconds
  }

}

function requestGetApi(ApiName, cb, headers, completeCallback) {
  wx.showLoading({
    title: '数据加载中',
  })
  wx.request({
    url: app.globalData.serverUrl + ApiName,
    header: headers,
    success: function(res) {
      wx.hideLoading();
      if (res.data.code == '200') {
        typeof cb == "function" && cb(null, res)
      } else if (res.data.code == 'SOCIALACCOUNT_NOT_EXIST' || res.data.code == 'TOKEN_WRONG' || res.data.code == 'WX_TOKEN_NOT_EXIST' || res.data.code == 'TOKEN_OUT_TIME') {
        if (app.globalData.tmsAppToken == headers['tms-app-token'] &&
          !app.globalData.directLoginPageFlag) {
          app.globalData.directLoginPageFlag = true
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function(res) {
      console.log(res)
      wx.hideLoading();
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 4000
      })
    },
    complete: function(res) {
      typeof completeCallback == "function" && completeCallback(res)
    }
  })
}


function requestPostApi(ApiName, PostData, cb, completeCallback, isShowLoading) {
  if (isShowLoading) {} else {
    wx.showLoading({
      title: '数据加载中',
    })
  }
  wx.request({
    url: app.globalData.serverUrl + ApiName,
    data: PostData.data,
    method: 'POST',
    header: PostData.header,
    success: function(res) {
      console.log(res)
      if (isShowLoading) {} else {
        wx.hideLoading();

      } "TOKEN_WRONG"
      if (res.data.code == '200') {
        
        typeof cb == "function" && cb(null, res)
      } else if (res.data.code == 'SOCIALACCOUNT_NOT_EXIST' || res.data.code == 'TOKEN_WRONG' || res.data.code == 'WX_TOKEN_NOT_EXIST' || res.data.code == 'TOKEN_OUT_TIME') {
        if (app.globalData.tmsAppToken == PostData.header['tms-app-token']
          && !app.globalData.directLoginPageFlag) {
          app.globalData.directLoginPageFlag = true
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      } else if (res.data.code == '400') {
        typeof cb == "function" && cb(null, res)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function(res) {
      console.log(res)

      if (isShowLoading) {} else {
        wx.hideLoading();

      }
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 4000
      })
      
    },
    complete: function(res) {

      typeof completeCallback == "function" && completeCallback(res)
    }
  })
}




//POST请求

function codeFun(paraData, cb) { //// 调用登录接口获取临时登录凭证（code）tmsAppToken
  requestGetApi('login/wx/token/' + paraData.code, cb)
}



function saveFun(paraData, cb) { //登入
  requestPostApi('login/wx', paraData, cb)
}


function searchWordFun(paraData, cb) { //首页搜索
  requestPostApi('index/search', paraData, cb)
}

function detailsOfTheWaybillFun(paraData, cb) { //// 运单详情
  requestPostApi('waybill/list', paraData, cb)
}

function dayStatisticsFun(paraData, cb) { //接口名称: 当天统计
  requestPostApi('/index/day/statistics', paraData, cb)
}



function storeListFun(paraData, cb) { //// 运单详情 运单
  requestPostApi('store/list', paraData, cb)
}

function customerKhphSfFun(paraData, cb) {//应收应付
  requestPostApi('customer/khph/sf', paraData, cb)
}
function customerProfitFun(paraData, cb) {//客户利润
  requestPostApi('customer/profit', paraData, cb)
}
function customerPhFun(paraData, cb) {//客户排行
  requestPostApi('customer/ph', paraData, cb)
}
function networkWdlrFun(paraData, cb) {// 网点利润
  requestPostApi('network/wdlr', paraData, cb)
}
function cartProfitFun(paraData, cb) {// 大车统计
  requestPostApi('cart/profit', paraData, cb)
}
function networkTurnoverFun(paraData, cb) {//网点营业额
  requestPostApi('network/turnover', paraData, cb)
}
function networkSendGoodsFun(paraData, cb) {//发货统计
  requestPostApi('network/send/goods', paraData, cb)
}
function networkArriveGoodsFun(paraData, cb) {//到货统计
  requestPostApi('network/arrive/goods', paraData, cb)
}
function roadProfitFun(paraData, cb) {//线路统计
  requestPostApi('road/profit', paraData, cb)
}


function carArriveManagerFun(paraData, cb) { //配载到站列表
  requestPostApi('car/arrive/manager', paraData, cb)
}
function carSendArriveFun(paraData, cb) { //配载发站列表
  requestPostApi('car/send/arrive', paraData, cb)
}


function selfMessage(paraData, cb) { //接口名称: 一周汇总
  requestPostApi('self/message', paraData, cb)
}

//get请求


function weeklyStatisticsFun(paraData, cb) { //接口名称: 一周汇总
  requestGetApi('/index/weekly/statistics', cb, paraData.header)
}


function vehicleDetailsFun(paraData, cb) { //配载详情
  requestGetApi('car/waybill/detail?stowageId=' + paraData.id + '&type=' + paraData.Type, cb, paraData.header)
}

function carDepartFun(paraData, cb) { ////发车
  requestGetApi('car/depart?stowageId=' + paraData.stowageId, cb, paraData.header)
}
function carArriveFun(paraData, cb) { //到站
  requestGetApi('car/arrive?stowageId=' + paraData.stowageId, cb, paraData.header)
}


function carSummaryFun(paraData, cb) { ////  配载车辆配载
  requestGetApi('car/summary', cb, paraData.header)
}
function storeSummaryFun(paraData, cb) { //// 配载网点库存
  requestGetApi('store/summary', cb, paraData.header)
}


function waybillDetailsFun(paraData, cb) { //// 运单详情 运单

  requestGetApi('waybill/details?waybillId=' + paraData.waybillId, cb, paraData.header)
}
function waybillCostFun(paraData, cb) { //// 运单详情 成本
  requestGetApi('waybill/cost?waybillId=' + paraData.waybillId, cb, paraData.header)
}
function waybillTransportFun(paraData, cb) { //// 运单详情 运输
  requestGetApi('waybill/transport?waybillId=' + paraData.waybillId, cb, paraData.header)
}
function waybillTrackFun(paraData, cb) { //// 运单详情 跟踪
  requestGetApi('waybill/track?waybillId=' + paraData.waybillId, cb, paraData.header)
}

function waybillAbnormalFun(paraData, cb) { //// 运单详情 异常
  requestGetApi('waybill/exception?waybillId=' + paraData.waybillId, cb, paraData.header)
}
function waybillReceiptFun(paraData, cb) { //// 运单详情 回单
  requestGetApi('waybill/receipt?waybillId=' + paraData.waybillId, cb, paraData.header)
}
function waybillChangelistFun(paraData, cb) { //// 运单详情 改单
  requestGetApi('waybill/change?waybillId=' + paraData.waybillId, cb, paraData.header)
}
function waybillWarehouseFun(paraData, cb) { //// 运单详情 进仓
  requestGetApi('waybill/instore?waybillId=' + paraData.waybillId, cb, paraData.header)
}
function waybillPaymentFun(paraData, cb) { //// 运单详情 货款
  requestGetApi('waybill/goodsfee?waybillId=' + paraData.waybillId, cb, paraData.header)
}
function waybillSettlementFun(paraData, cb) { //// 运单详情 结算
  requestGetApi('waybill/balance?waybillId=' + paraData.waybillId, cb, paraData.header)
}
function waybillSmsFun(paraData, cb) { //// 运单详情 短信
  requestGetApi('waybill/sms?waybillId=' + paraData.waybillId, cb, paraData.header)
}
module.exports = {
  formatTime: formatTime,
  saveFun,
  codeFun,
  searchWordFun,
  detailsOfTheWaybillFun,
  dayStatisticsFun,//接口名称: 当天统计,
  weeklyStatisticsFun,//接口名称: 一周汇总,get
  waybillDetailsFun,//运单
  waybillCostFun,// 成本
  waybillTransportFun,//运输
  waybillTrackFun,//跟踪
  waybillReceiptFun,//回单
  waybillAbnormalFun,//异常
  waybillChangelistFun,//改单
  waybillWarehouseFun,//进仓
  waybillPaymentFun,//货款
  waybillSettlementFun,//结算
  waybillSmsFun,//短信,
  storeSummaryFun,//网点库存
  storeListFun,//网点库存列表
  carSummaryFun, //  车辆配载
  carArriveManagerFun,//到站列表
  carSendArriveFun,//发站列表
  carDepartFun,//发车
  carArriveFun,//到站
  vehicleDetailsFun,//配载详情
  customerKhphSfFun,//应收应付
  customerProfitFun,//客户利润
  customerPhFun,//客户排行
  networkWdlrFun,// 网点利润
  cartProfitFun,// 大车统计
  networkTurnoverFun,//网点营业额
  networkSendGoodsFun,//发货统计
  networkArriveGoodsFun,//到货统计
  roadProfitFun,//线路统计
  signTimeCalculation,//时间换算
  selfMessage,//个人中心企业信息

}


