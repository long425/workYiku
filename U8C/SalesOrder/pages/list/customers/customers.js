Page({
  data: {
    DATA: {},
    customerList: []
  },
  onLoad() {
    var that = this;
    dd.getStorage({ key: "DATA", success: (res) => {
      if(res.data){ that.setData({ DATA: JSON.parse(res.data) })};
    }});
    this.getCustomerList();
  },
  onSearchBarTap() {
    dd.navigateTo({ url: '/pages/search/customer/customer' });
  },
  getCustomerList() {
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var usercode = getApp().globalData.U8C.usercode;
    var password = getApp().globalData.U8C.password;

    dd.httpRequest({
      headers: { "system": system, "usercode": usercode, "password": password },
      url: "http://"+port+"/u8cloud/api/uapbd/custdoc/query",
      method: "POST",
      data: JSON.stringify({}),
      dataType: 'json',
      success: res => {
        if(res.data.status === 'success'){
          var customerData = JSON.parse(res.data.data);
          that.setData({ customerList: customerData.datas });
        };
      }
    });
  },
  checkCustomer(e) {
    var that = this;
    var emptyDATA = { parentvo: {}, childrenvo: {} };
    var DATA = (Object.keys(that.data.DATA).length > 0) ? that.data.DATA : emptyDATA;
    DATA.parentvo.ccustomername = e.target.dataset.name;
    DATA.parentvo.ccustomerid = e.target.dataset.code;
    dd.setStorage({key: "DATA",data: JSON.stringify(DATA), success: () => {
      dd.reLaunch({ url: '/pages/index/addNew/addNew' });
    }});
  }
});