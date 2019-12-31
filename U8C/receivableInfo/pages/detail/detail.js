Page({
  data: {
    headerData: '',
    stockData: ''
  },
  onLoad(query) {
    var that = this;
    var orderData = JSON.parse(query.orderData);
    var headerData = orderData.parentvo;
    var stockData = orderData.childrenvo;
    that.setData({ headerData: headerData, stockData: stockData});
  },
});
