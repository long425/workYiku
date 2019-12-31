Page({
  data: {
    searchVal: '',
    customerList: []
  },
  onLoad() {
  },
  onInput(e){
    var that = this;
    that.setData({
      searchVal: e
    });
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
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
    var params = '?from_account='+ U8Data.from_account +'&to_account='+U8Data.to_account+'&app_key=' + U8Data.appKey + '&token=' + token + stock;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/customer/batch_get' + params,
        method: 'GET',
        success: (res) => {
          that.setData({
            customerList: res.data.customer
          });
        },
        fail: error => {
          console.log(error);
        }
      });
    }else {
      that.setData({
        searchVal: '',
        customerList: []
      });
    };
  },
  doneSearch(e){
    var that = this;
    that.setData({
      searchVal: e
    });
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
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
    var params = '?from_account='+ U8Data.from_account +'&to_account='+U8Data.to_account+'&app_key=' + U8Data.appKey + '&token=' + token + stock;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/customer/batch_get' + params,
        method: 'GET',
        success: (res) => {
          that.setData({
            customerList: res.data.customer
          });
        },
        fail: error => {
          console.log(error);
        }
      });
    }else {
      that.setData({
        searchVal: '',
        customerList: []
      });
    };
  },
  
  onCancel(){
    var that = this;
    that.setData({
      searchVal: '',
      customerList: []
    });
  },
  checkCustomer(e){
    var that = this;
    var customerName = e.target.dataset.name;
    var customerCode = e.target.dataset.code;
    let cusname = e.target.dataset.name;
    let cuscode = e.target.dataset.code;
    let customer = JSON.stringify({cusname: cusname,cuscode: cuscode});
    dd.setStorage({
      key: 'customer',
      data: customer,
      success: function() {
        dd.reLaunch({
          url: '/pages/index/addNew/addNew'
        });
      }
    });
  }
});
