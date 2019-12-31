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
  getCustomList(event){
    var that = this;
    var port = getApp().globalData.port;
    var system = getApp().globalData.system;
    var usercode = getApp().globalData.usercode;
    var password = getApp().globalData.password;

    var data = (escape(that.data.searchVal).indexOf( "%u" ) < 0) ? JSON.stringify({"custcode": event}) : JSON.stringify({"custname": event});

    dd.httpRequest({
      headers: {system:system,usercode:usercode,password:password},
      url: "http://" + port + "/u8cloud/api/uapbd/custdoc/query",
      method: "POST",
      data: data,
      dataType: 'json',
      success: res => {
        if(res.data.status === 'success'){
          var customData = (JSON.parse(res.data.data).datas) ? JSON.parse(res.data.data).datas : [];
          that.setData({ customerArr: customData });
        };
      }
    });
  },
  checkCustom(event){
    var that = this;
    var custom = {name: event.target.dataset.name,code:event.target.dataset.code};
    dd.setStorage({ key: 'custom', data: JSON.stringify(custom),success: () => {
      dd.reLaunch({ url: '/pages/index/index' });
    } });
  }
});
