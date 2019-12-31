Page({
  data: {
    date: { start: '', end: '' },
    custom: { name: '', code: '' },
    orderList: [],
  },
  onLoad(query) {
    var that = this;
    dd.showLoading({ content: '应收单据查找中...' });
    dd.getStorage({
      key: "custom",
      success: res => {
        if(res.data){ that.setData({custom: JSON.parse(res.data)});that.getOrderList(JSON.parse(res.data)); }else{that.getOrderList();};
        dd.removeStorage({ key: 'custom' });
      }
    })
    
  },
  getOrderList(code){ // 获取应付单据列表
    var that = this;
    var corp = getApp().globalData.corp;
    var port = getApp().globalData.port;
    var system = getApp().globalData.system;
    var usercode = getApp().globalData.usercode;
    var password = getApp().globalData.password;
    var dateStart = that.data.date.start;
    var dateEnd = that.data.date.end;
    var customCode = code ? code.code : '';
    var data = {"dwbm":corp, "djrq_from":dateStart, "djrq_to":dateEnd};

    dd.httpRequest({
      headers: { system: system, usercode: usercode, password: password },
      url: 'http://' + port + '/u8cloud/api/arap/yf/pagequery',
      method: 'POST',
      data: JSON.stringify(data),
      dataType: 'json',
      success: res => {
        dd.hideLoading();
        if(res.data.status === 'success'){
          var data = JSON.parse(res.data.data).datas ? JSON.parse(res.data.data).datas : [];
          that.setData({ orderList: data });
        };
      }
    });
  },
  changeOrderStartDate(){ // 单据日期从
    var that = this;
    dd.datePicker({
      format: 'yyyy-MM-dd',
      startDate: '2017-01-01',
      endDate: '2119-01-01',
      success: res => {
        if(Object.keys(res).length > 0){
          var date = that.data.date;
          date.start = res.date;
          that.setData({date: date});
          that.getOrderList();
        };
      }
    });
  },
  changeOrderEndDate(){ // 单据日期至
    var that = this;
    dd.datePicker({
      format: 'yyyy-MM-dd',
      startDate: '2017-01-01',
      endDate: '2119-01-01',
      success: res => {
        if(Object.keys(res).length > 0){
          var date = that.data.date;
          date.end = res.date;
          that.setData({date: date});
          that.getOrderList();
        };
      }
    });
  },
  checkCustom(){
    var that = this;
    dd.navigateTo({ url: '/pages/custom/custom' });
  },
  checkDetail(event){  // 查看应付单据详情
    var that = this;
    var orderData = that.data.orderList;
    var clickIndex = event.currentTarget.dataset.site;
    var clickOrderData = JSON.stringify(orderData[clickIndex]);
    dd.navigateTo({ url: '/pages/detail/detail?orderData=' + clickOrderData });
  }
});
