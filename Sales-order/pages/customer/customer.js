Page({
  data: {
    customerNameArr: []
  },
  onLoad() {
    var that = this;
    var token = getApp().globalData.token;
    var appKey = getApp().globalData.appKey_U8;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token;
    dd.httpRequest({
      url:'https://api.yonyouup.com/api/customer/batch_get' + params,
      method: 'GET',
      success: res => {
        var rVal = res.data;
        that.setData({
          customerNameArr:rVal.customer
        });
      },
      fail: error => {
        console.log(error);
      }
    })
  },
  onSearchBarTap(){
    dd.navigateTo({
      url: '/pages/search/search'
    })
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
