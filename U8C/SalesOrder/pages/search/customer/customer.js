Page({
  data: {
    searchVal: '',
    customerArr: []
  },
  onLoad() {
    this.getCustomList();
  },
  onInput(e){
    var that = this;
    that.setData({searchVal: e});
    that.getCustomList(e);
  },
  doneSearch(e){
    var that = this;
    that.setData({searchVal: e});
    that.getCustomList(e);
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
  },
  getCustomList(event){
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var usercode = getApp().globalData.U8C.usercode;
    var password = getApp().globalData.U8C.password;

    // var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    if (escape(that.data.searchVal).indexOf( "%u" ) < 0){   // 判断输入的是不是汉字
      var stock = JSON.stringify({"custcode": event});
    } else {
      var stock = JSON.stringify({"custname": event});
    }

    dd.httpRequest({
      headers: { "system": system, "usercode": usercode, "password": password },
      url: "http://"+port+"/u8cloud/api/uapbd/custdoc/query",
      method: "POST",
      data: stock,
      dataType: "json",
      success: res => {
        if(res.data.status === 'success'){
          var customData = JSON.parse(res.data.data).datas;
          console.log(customData)
          that.setData({ customerArr: customData });
        };
      }
    });
  }
});
