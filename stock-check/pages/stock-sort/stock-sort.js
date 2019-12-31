Page({
  data: {
    sortList: []
  },
  // 页面加载
  onLoad() {},
  // 页面加载完成
  onReady() {
    this.getToken();
  },
  // 获取唯一全局识别码Token
  getToken() {
    var that = this;
    var appKey = getApp().globalData.U8.appKey;
    var appSecret = getApp().globalData.U8.appSecret;
    var params = '?from_account=ZJYiKu&app_key=' + appKey + '&app_secret=' + appSecret;
    dd.showLoading({
      content: '请稍后，正在查询库存分类...'
    });

    dd.httpRequest({
      url:'https://api.yonyouup.com/system/token' + params,
      method: 'GET',
      success:function(res){
        if(res.data.errcode == 0){
          that.setData({
            'getApp().globalData.token': res.data.token.id
          })
          getApp().globalData.token = res.data.token.id;
          that.getStockSortList(getApp().globalData.token);
        };
      }
    });
  },
  // 获取存货分类列表
  getStockSortList(_token) {
    var that = this;
    var appKey = getApp().globalData.U8.appKey;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key='+ appKey +'&token=' + _token;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/inventoryclass/batch_get' + params,
      method: 'GET',
      success: res => {
        if(res.data.errcode == '0'){
          dd.hideLoading();
          if(res.data.inventoryclass.length == 0){
            dd.showToast({
              type: 'fail',
              content: '未查询到存货分类，3S后跳转至存货查询页',
              duration: 3000,
              success: () => {
                dd.navigateTo({
                  url: '/pages/index/index'
                });
              },
            });
          }else{
            that.setData({
              sortList: res.data.inventoryclass
            });
          };
        };
      },
      fail: error => {
        console.log(error);
      }
    });
  },
  // 选择需要查看的存货分类，前往存货查询页
  checkSort(e){
    var that = this;
    var sortCode = e.target.dataset.code;
    var sortName = e.target.dataset.name;
    dd.navigateTo({
      url: '/pages/index/index?sortCode=' + sortCode + '&sortName=' + sortName
    });
  }
});
