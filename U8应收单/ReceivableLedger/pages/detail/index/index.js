Page({
  data: {
    code: '',
    detail: ''
  },
  onLoad(query) {
    dd.showLoading({content: '查询应收明细账详情，请稍候....'})
    if(query && query.code) this.setData({ code: query.code }); this.getReceiptDetail(query.code);
  },
  getReceiptDetail(code) {
    var that = this;
    var fromAccount = getApp().globalData.U8.from_account;
    var toAccount = getApp().globalData.U8.to_account;
    var appKey = getApp().globalData.U8.appKey;
    var token = getApp().globalData.token;
    var params = '?from_account='+fromAccount+'&to_account='+toAccount+'&app_key='+appKey+'&token='+token+'&id='+code;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/oughtreceive/get' + params,
      method: 'GET',
      success: res => {
        dd.hideLoading();
        if(res.data && res.data.errcode == '0'){
          that.setData({detail: res.data.oughtreceive})
        }
      },
      fail: error => console.log(error)
    });
  }
});
