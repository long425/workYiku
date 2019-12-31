Page({
  data: {
    focus: false,
    searchVal: '',
    customerList: []
  },
  onLoad() {
    dd.showLoading({ content: '查询客商列表，请稍候...' })
    this.getCustomList();
  },
  onFocus(e){ this.setData({ focus: true,customerList: [] });},
  onInput(e){
    var that = this;
    that.setData({ searchVal: e });
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var customName = encodeURI(that.data.searchVal);
    // 利用正则表达式判断输入的类型
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    if(reg.test(that.data.searchVal)) var stock = '&code_begin=' + e + '&code_end=' + e 
    else var stock = '&name=' + encodeURI(e)
    var params = '?from_account='+ U8Data.from_account +'&to_account='+U8Data.to_account+'&app_key=' + U8Data.appKey + '&token=' + token + stock;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/customer/batch_get' + params,
        method: 'GET',
        success: (res) => {
          if(res.data && res.data.errcode == '0') that.setData({ customerList: res.data.customer })
        },
        fail: error => console.log(error)
      });
    }else {
      that.setData({ searchVal:'',customerList:[] })
    };
  },
  doneSearch(e){
    var that = this;
    that.setData({ searchVal: e });
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var customName = encodeURI(that.data.searchVal);
    // 利用正则表达式判断输入的类型
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    if(reg.test(that.data.searchVal)) var stock = '&code_begin=' + e + '&code_end=' + e
    else var stock = '&name=' + encodeURI(e)
    var params = '?from_account='+ U8Data.from_account +'&to_account='+U8Data.to_account+'&app_key=' + U8Data.appKey + '&token=' + token + stock;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/customer/batch_get' + params,
        method: 'GET',
        success: (res) => {
          if(res.data && res.data.errcode == '0') that.setData({ customerList: res.data.customer })
        },
        fail: error => console.log(error)
      });
    }else {
      that.setData({ searchVal: '',customerList: [] })
    };
  },
  onCancel(){
    var that = this;
    that.getCustomList();
    that.setData({ focus: true,searchVal: '' });
  },
  checkCustomer(e){
    var that = this;
    var cusname = e.target.dataset.name;
    var cuscode = e.target.dataset.code;
    var customer = JSON.stringify({cusname: cusname,cuscode: cuscode});
    dd.setStorage({
      key: 'customer',
      data: customer,
      success: function() {
        dd.reLaunch({ url: '/pages/index/ledger/ledger' });
      }
    });
  },
  getCustomList() {
    var that = this;
    var fromAccount = getApp().globalData.U8.from_account;
    var toAccount = getApp().globalData.U8.to_account;
    var appKey = getApp().globalData.U8.appKey;
    var token = getApp().globalData.token;
    var params = '?from_account='+fromAccount+'&to_account='+toAccount+'&app_key='+appKey+'&token='+token;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/customer/batch_get' + params,
      method: 'GET',
      success: res => {
        if(res.data && res.data.errcode == '0') dd.hideLoading(); that.setData({ customerList: res.data.customer })
      },
      fail: error => console.log(error)
    });
  }
});