Page({
  data: {
    noResult: false,
    date: { start: '',end: '' },
    custom: { code: '',name: '' },
    orderList: []
  },
  onLoad() {
    var that = this;
    dd.showLoading({ content: '查询应收单列表，请稍候...'});
    dd.getStorage({
      key: 'customer',
      success: res => {
        if(res.data && res.data != ''){
          var custom = that.data.custom
          custom.code = JSON.parse(res.data).cuscode
          custom.name = JSON.parse(res.data).cusname
          that.setData({ custom: custom });
          dd.removeStorage({ key: 'customer' })
        }
      }
    });
    that.getGlobalToken();
  },
  // 获取全局token参数
  getGlobalToken() {
    var that = this;
    var fromAccount = getApp().globalData.U8.from_account;
    var appKey = getApp().globalData.U8.appKey;
    var appSecret = getApp().globalData.U8.appSecret;
    var params = '?from_account=' + fromAccount + '&app_key=' + appKey + '&app_secret=' + appSecret;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/system/token' + params,
      method: 'GET',
      success: res => {
        if(res.data && res.data.errcode === '0') {
          that.setData({
            'getApp().globalData.token': res.data.token.id
          });
          getApp().globalData.token = res.data.token.id;

          that.getReceivables(res.data.token.id);
        };
      },
      fail: error => console.log(error)
    });
  },
  // 批量获取应收单据列表
  getReceivables(token) {
    var that = this;
    var fromAccount = getApp().globalData.U8.from_account;
    var toAccount = getApp().globalData.U8.to_account;
    var appKey = getApp().globalData.U8.appKey;
    if(token == '' && token == null && token == undefined) {
      dd.showToast({ type: 'fail', content: '客户端未登录，请检查服务器是否启动并重新登录',duration: 2000 });
      return
    };
    var start = that.data.date.start;
    var end = that.data.date.end;
    var code = that.data.custom.code;
    var bill = '&date_begin='+start+'&date_end='+end+'&cust_vendor_code='+code;
    var params = '?from_account='+fromAccount+'&to_account='+toAccount+'&app_key='+appKey+'&token='+token + bill;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/oughtreceivelist/batch_get' + params,
      method: 'GET',
      success: res => {
        dd.hideLoading();
        if(res.data && res.data.errcode === '0') {
          that.setData({ noResult: false,orderList: res.data.oughtreceivelist });
        }else if(res.data && res.data.errcode == '20002') {
          that.setData({ noResult: true })
        }
      },
      fail: error => {
        console.log(error);
      }
    });
  },
  // 选择开始时间
  screenStart() {
    var that = this;
    dd.datePicker({
      format: 'yyyy-MM-dd',
      startDate: '2019-01-01',
      endDate: '2119-01-01',
      success: res => {
        if(Object.keys(res).length > 0){    // 对象是否为空
          var date = that.data.date;
          date.start = res.date;
          that.setData({ date: date });
          dd.showLoading({content:'查询应收单列表，请稍候...'});
          var Gtoken = getApp().globalData.token;
          that.getReceivables(Gtoken);
        };
      },
      fail: error => console.log(error)
    });
  },
  // 选择结束时间
  screenEnd() {
    var that = this;
    dd.datePicker({
      format: 'yyyy-MM-dd',
      startDate: '2019-01-01',
      endDate: '2119-01-01',
      success: res => {
        if(Object.keys(res).length > 0) {
          var date = that.data.date;
          date.end = res.date;
          that.setData({ date: date });
          dd.showLoading({content:'查询应收单列表，请稍候...'});
          var Gtoken = getApp().globalData.token;
          that.getReceivables(Gtoken);
        };
      },
      fail: error => console.log(error)
    });
  },
  // 选择查看客户
  screenCustom() {
    var that = this;
    dd.navigateTo({ url: '/pages/search/customer/customer' });
  },
  checkItem(event) {
    var that = this;
    var code = event.currentTarget.dataset.code;
    dd.navigateTo({ url: '/pages/detail/index/index?code=' + code })
  }
});
