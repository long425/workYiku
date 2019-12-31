Page({
  data: {
    orderData: '',
    headerData: '',
    stockData: ''
  },
  onLoad(query) {
    if(query && query.orderData) {
      var totalData = JSON.parse(query.orderData);
      var headerData = totalData.parentvo;
      var stockData = totalData.childrenvo;
      console.log(headerData);
      console.log(stockData);
      if(headerData.fstatus == 1) { headerData.fstatus = '未审批'}else if(headerData.fstatus == 2) { headerData.fstatus = '已审批'}
      this.setData({ 
        orderData: totalData,
        headerData: headerData,
        stockData:  stockData
      });
    };
  }
});
