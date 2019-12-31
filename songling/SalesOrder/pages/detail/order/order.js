Page({
  data: {
    orderId: '',
    saleOrderDetail: ''
  },
  onLoad(query) {
    var that = this;
    
    that.setData({ orderId: query.orderId });
    that.getOrderDetail(query.orderId);
  },
  getOrderDetail(order) {
    var that = this;
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var params = '?from_account='+U8Data.from_account+'&to_account='+U8Data.to_account+'&app_key='+U8Data.appKey+'&token='+token+'&id='+order;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/saleorder/get' + params,
      method: 'GET',
      success: res => {
        dd.hideLoading();
        if(res.data.errcode == '0'){
          var money = 0;
          for(var i = 0; i<res.data.saleorder.entry.length; i++){
            money += parseFloat(res.data.saleorder.entry[i].money);
          };
          that.setData({
            saleOrderDetail: res.data.saleorder,
            saleOrderRow: res.data.saleorder.entry,
            moneyAll: money
          });
        };
      }
    });
  },
  checkOrderRowDetail(e) {
    var that = this;
    var orderIndex = e.currentTarget.dataset.index;
    var orderId = that.data.orderId;
    dd.navigateTo({
      url: '/pages/detail/stock/stock?orderIndex=' + orderIndex + '&orderId=' + orderId
    });
  }
});
