Page({
  data: {
    stockList: []
  },
  // 页面加载
  onLoad(query) {
    var that = this;
    // 添加Loading
    dd.showLoading({
      content: '查找存货列表中，请稍候...'
    });
    var sortData = Object.keys(query);
    if(sortData.length != 0){   // 选择了具体的存货分类
      var sortCode = query.sortCode;
      var sortName = query.sortName;
    };
    that.getStockList(sortCode);
  },
  // 页面加载完成
  onReady() {

  },
  // 获取存货列表
  getStockList(code) {
    var that = this;
    var appKey = getApp().globalData.U8.appKey;
    var token = getApp().globalData.token;
    var params = code ? '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key='+ appKey +'&token=' + token + '&sort_code=' + code : '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key='+ appKey +'&token=' + token;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/inventory/batch_get' + params,
      method: 'GET',
      success: (res) => {
        dd.hideLoading();
        that.setData({
          stockList: res.data.inventory
        });
      },
      fail: error => {
        console.log(error);
      }
    });
  },
  // 跳转至搜索页面
  onSearchBarTap(){
    dd.navigateTo({
      url: '/pages/search/search'
    });
  },
  checkStock(e) {
    var that = this;
    var stockCode = e.target.dataset.code;
    var stockName = e.target.dataset.name;
    dd.navigateTo({
      url: '/pages/stock-detail/stock-detail?stockCode=' + stockCode + '&stockName=' + stockName
    });
  }
});
