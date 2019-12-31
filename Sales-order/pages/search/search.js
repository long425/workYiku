Page({
  data: {
    searchVal: '',
    customerArr: []
  },
  onLoad() {
  },
  onInput(e){
    var that = this;
    that.setData({
      searchVal: e
    });
    var appKey = getApp().globalData.app_key;
    var token = getApp().globalData.token;
    var customName = encodeURI(that.data.searchVal);
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + '&name=' + customName;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url:'https://api.yonyouup.com/api/customer/batch_get' + params,
        method: 'GET',
        success: res =>{
          var rVal = res.data;
          if(rVal.errcode == 0){
            that.setData({
              customerArr:rVal.customer
            });
          }else if(rVal.errcode == '20002'){
            that.setData({
              customerArr: []
            });
          };
        },
        fail: err => {
          console.log(err.errorMessage)
        },
      });
    }else {
      that.setData({
        searchVal: '',
        customerArr: []
      })
    };
  },
  doneSearch(e){
    var that = this;
    that.setData({
      searchVal: e
    });
    var appKey = getApp().globalData.appKey_U8;
    var token = getApp().globalData.token;
    var customName = encodeURI(that.data.searchVal);
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + '&name=' + customName;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url:'https://api.yonyouup.com/api/customer/batch_get' + params,
        method: 'GET',
        success: res =>{
          var rVal = res.data;
          if(rVal.errcode == 0){
            that.setData({
              customerArr:rVal.customer
            });
          }else if(rVal.errcode == '20002'){
            that.setData({
              customerArr: []
            });
          };
        },
        fail: err => {
          console.log(err.errorMessage)
        },
      });
    }else {
      that.setData({
        searchVal: '',
        customerArr: []
      })
    };
  },
  onCancel(){
    var that = this;
    that.setData({
      searchVal: '',
      customerArr: []
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
  }
});
