Page({
  data: {
    sortCode: '',
    searchVal: '',
    stockList: []
  },
  onLoad(query) {
    var that = this;
    if(Object.keys(query).length > 0) { var sortCode = query.code; that.setData({ sortCode: sortCode })};
    that.getStockList(sortCode);
  },
  onInput(event){
    var that = this;
    var sortCode = that.data.sortCode;
    that.setData({ searchVal: event });
    that.getStockList(sortCode,event);
  },
  doneSearch(event){
    var that = this;
    var sortCode = that.data.sortCode;
    that.setData({ searchVal: event });
    that.getStockList(sortCode,event);    
  },
  onCancel(){
    var that = this;
    var sortCode = that.data.sortCode;
    that.setData({ searchVal: ''});
    that.getStockList(sortCode);
  },
  getStockList(sort,variable){
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var usercode = getApp().globalData.U8C.usercode;
    var password = getApp().globalData.U8C.password;

    if (escape(that.data.searchVal).indexOf( "%u" ) < 0){   // 判断输入的是不是汉字
      var data = JSON.stringify({"invclcode": sort,"invcode": variable});
    } else {
      var data = JSON.stringify({"invclcode": sort,"invname": variable});
    };

    dd.httpRequest({
      headers: { "system": system, "usercode": usercode, "password": password },
      url: "http://"+port+"/u8cloud/api/uapbd/invbasdoc/query",
      method: "POST",
      data: data,
      dataType: "json",
      success: res => {
        if(res.data.status === 'success'){
          var stockListData = JSON.parse(res.data.data).datas;
          var stockList = [];
          if(stockListData && stockListData.length > 0){
            stockListData.forEach(item => stockList.push(item.parentvo));
          }
          that.setData({stockList: stockList});
        };
      }
    });
  },
  checkStockDetail(event) {
    var that = this;
    var stockCode = event.target.dataset.code;
    dd.navigateTo({ url: '/pages/index/detail/detail?stockCode=' + stockCode })
  }
});
