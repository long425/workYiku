Page({
  data: {
    stockDetail: [],
  },
  onLoad(query) {
    dd.showLoading({
      content: '正在查看存货详情，请稍候...'
    });
    var that = this;
    var stockCode = query.stockCode;
    var stockName = query.stockName;
    var appKey = getApp().globalData.U8.appKey;
    var token = getApp().globalData.token;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + '&invcode_begin=' + stockCode + '&invcode_end=' + stockCode;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/currentstock/batch_get' + params,
      method: 'GET',
      success: res => {
        if(res.data.errcode == '0'){
          dd.hideLoading();
          that.setData({
            stockDetail: res.data.currentstock[0]
          });
        };
      },
      fail: error => {
        console.log(error);
      }
    })
  },
});
