Page({
  data: {
    orderId: '',
    saleOrderDetail: '',
    saleOrderRow: [],
    moneyAll: ''
  },
  onLoad(query){
    var that = this;
    var appKey = getApp().globalData.appKey_U8;
    var token = getApp().globalData.token;
    var orderId = query.orderId;
    dd.showLoading({
      content: '查询订单详情，请稍候。。。'
    });
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + '&id=' + orderId;
    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/saleorder/get' + params,
      dataType: 'json',
      method: 'GET',
      success: res => {
        dd.hideLoading();
        var money = 0;
        for(var i = 0; i<res.data.saleorder.entry.length; i++){
          money += parseFloat(res.data.saleorder.entry[i].money);
        };
        that.setData({
          orderId: orderId,
          saleOrderDetail: res.data.saleorder,
          saleOrderRow: res.data.saleorder.entry,
          moneyAll: money
        });
      },
      fail: error => {
        console.log(error.data.errmsg)
      }
    });
  },
  checkOrderRowDetail(e){
    var that = this;
    var orderIndex = e.currentTarget.dataset.index;
    var orderId = that.data.orderId;
    dd.navigateTo({
      url: '/pages/order-row-detail/order-row-detail?orderIndex=' + orderIndex + '&orderId=' + orderId
    });
  }
});
