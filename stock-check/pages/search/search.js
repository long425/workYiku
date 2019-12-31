Page({
  data: {
    searchVal: '',
    stockList: []
  },
  onLoad() {
  },
  // 
  onInput(e){
    var that = this;
    that.setData({
      searchVal: e
    });
    var appKey = getApp().globalData.U8.appKey;
    var token = getApp().globalData.token;
    var customName = encodeURI(that.data.searchVal);
    // 利用正则表达式判断输入的类型
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    if(reg.test(that.data.searchVal)){
      // 输入的是数字
      var stock = '&code_begin=' + e + '&code_end=' + e; 
    }else{
      // 输入的不是数字
      var stock = '&name=' + encodeURI(e);
    };
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + stock;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/inventory/batch_get' + params,
        method: 'GET',
        success: (res) => {
          that.setData({
            stockList: res.data.inventory
          });
        },
        fail: error => {
          console.log(error);
        }
      });
    }else {
      that.setData({
        searchVal: '',
        stockList: []
      });
    };
  },
  doneSearch(e){
    var that = this;
    that.setData({
      searchVal: e
    });
    var appKey = getApp().globalData.U8.appKey;
    var token = getApp().globalData.token;
    var customName = encodeURI(that.data.searchVal);
    // 利用正则表达式判断输入的类型
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    if(reg.test(that.data.searchVal)){
      // 输入的是数字
      var stock = '&code_begin=' + e + '&code_end=' + e; 
    }else{
      // 输入的不是数字
      var stock = '&name=' + encodeURI(e);
    };
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + stock;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/inventory/batch_get' + params,
        method: 'GET',
        success: (res) => {
          that.setData({
            stockList: res.data.inventory
          });
        },
        fail: error => {
          console.log(error);
        }
      });
    }else {
      that.setData({
        searchVal: '',
        stockList: []
      });
    };
  },
  onCancel(){
    var that = this;
    that.setData({
      searchVal: '',
      stockList: []
    });
  },
  checkCustomer(e){
    var that = this;
    var customerName = e.target.dataset.name;
    var customerCode = e.target.dataset.code;
    dd.setStorage({
      key: 'currentCustomer',
      data: {
        customerName: e.target.dataset.name,
        customerCode: e.target.dataset.code
      },
      success: function() {
        dd.reLaunch({
          url: '/pages/add/add?name=' + customerName + '&code=' + customerCode
        });
      }
    });
  },
  checkStock(e) {
    var that = this;
    var stockCode = e.target.dataset.code;
    var stockName = e.target.dataset.name;
    dd.navigateTo({
      url: '/pages/stock-detail/stock-detail?stockCode=' + stockCode + '&stockName=' + stockName
    })
  }
});
