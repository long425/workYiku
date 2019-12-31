Page({
  data: {
    customerList: []
  },
  // 页面加载中
  onLoad() {
    var that = this;
    that.getCustomerList()
  },
  // 前往查找客户页面
  onSearchBarTap() {
    dd.navigateTo({
      url: '/pages/search/customer/customer'
    });
  },
  // 获取全部客户列表
  getCustomerList() {
    var that = this;
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var params = '?from_account=' + U8Data.from_account + '&to_account=' + U8Data.to_account + '&app_key=' + U8Data.appKey + '&token=' + token;
    
    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/customer/batch_get' + params,
      method: 'GET',
      success: res => {
        if(res.data.errcode == '0'){
          that.setData({
            customerList: res.data.customer
          });
        };
      }
    })
  },
  //选择客户
  checkCustomer(e) {
    let that = this;
    let token = getApp().globalData.token;

    let cusname = e.target.dataset.name;
    let cuscode = e.target.dataset.code;
    let customer = JSON.stringify({cusname: cusname,cuscode: cuscode});
    
    // 将客户名称和编码存入缓存
    dd.setStorage({
      key: 'customer',
      data: customer,
      success: res => {
        dd.reLaunch({
          url: '/pages/index/addNew/addNew'
        });
      },
      fail: error => {
        console.log(error)
      }
    })
  }
});