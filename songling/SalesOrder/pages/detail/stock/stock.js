Page({
  data: {
    saleOrderDetail: '',
    saleOrderRow: ''
  },
  onLoad(query){
    var that = this;
    var orderId = query.orderId;
    var orderIndex = query.orderIndex;
    dd.showLoading({
      content: '查询订单行详情，请稍候。。。'
    });
    that.getSaleOrderStockDetail(orderIndex,orderId)
  },
  getSaleOrderStockDetail(index,id) {
    var that = this;
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var params = '?from_account='+U8Data.from_account+'&to_account='+U8Data.to_account+'&app_key=' +U8Data.appKey + '&token=' + token + '&id=' + id;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/saleorder/get' + params,
      method: 'GET',
      success: res => {
        dd.hideLoading();
        if(res.data.errcode == '0') {
          var rowDetail = res.data.saleorder.entry[index];
          rowDetail.quantity = Number(rowDetail.quantity).toFixed(2);
          rowDetail.unitprice = Number(rowDetail.unitprice).toFixed(2);
          rowDetail.taxunitprice = Number(rowDetail.taxunitprice).toFixed(2);
          rowDetail.money = Number(rowDetail.money).toFixed(2);
          rowDetail.sum = Number(rowDetail.sum).toFixed(2);
          that.setData({
            saleOrderDetail: res.data.saleorder,
            saleOrderRow: rowDetail
          });
        };
      }
    });
  }
});
