Page({
  data: {
    DATA: {},
    customerList: [],
    teamByStockList: []
  },
  onLoad() {
    var that = this;
    dd.getStorage({ key: "DATA", success: (res) => {
      if(res.data){ 
        that.setData({ DATA: JSON.parse(res.data) });
        that.getTeamByStock();
      };
    }});
  },
  // 查询销售组织列表
  getTeamByStock() {
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var usercode = getApp().globalData.U8C.usercode;
    var password = getApp().globalData.U8C.password;

    dd.httpRequest({
      headers: { "system":system, "usercode":usercode, "password": password },
      url: "http://"+port+"/u8cloud/api/uapbd/calbody/query",
      method: "POST",
      data: JSON.stringify({}),
      dataType: "json",
      success: res => {
        if(res.data.status === 'success'){
          var data = JSON.parse(res.data.data).datas;
          that.setData({ teamByStockList: data });
        };
      }
    })
  },
  checkTeamByStock(e) {
    var that = this;
    var emptyDATA = { parentvo: {}, childrenvo: {} };
    var DATA = (Object.keys(that.data.DATA).length > 0) ? that.data.DATA : emptyDATA;
    DATA.parentvo.ccalbodyname = e.target.dataset.name;
    DATA.parentvo.ccalbodyid = e.target.dataset.code;
    dd.setStorage({key: "DATA",data: JSON.stringify(DATA), success: () => {
      dd.reLaunch({ url: '/pages/index/addNew/addNew' });
    }});
  }
});