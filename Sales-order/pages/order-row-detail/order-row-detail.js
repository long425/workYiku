Page({
  data: {
    saleOrderDetail: '',
    saleOrderRow: ''
  },
  onLoad(query){
    var that = this;
    var appKey = getApp().globalData.appKey_U8;
    var token = getApp().globalData.token;
    var orderId = query.orderId;
    var orderIndex = query.orderIndex;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + '&id=' + orderId;
    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/saleorder/get' + params,
      dataType: 'json',
      method: 'GET',
      success: res => {
        var rowDetail = res.data.saleorder.entry[orderIndex];
        that.setData({
          saleOrderDetail: res.data.saleorder,
          saleOrderRow: rowDetail
        });
      },
      fail: error => {
        console.log(error.data.errmsg)
      }
    });
  }
});
