Page({
  data: {
    DATA: {},
    stockCheckList: [],
    items: [],
    customerNameArr: []
  },
  onReady() {
    var that = this;
    dd.getStorage({ key: 'DATA', success: res => {
      if(res.data){ that.setData({DATA: JSON.parse(res.data)})};
    }});
  },
  addStockList(e) {
    var that = this;
    var itemsList = that.data.items;
    var stockCheckList = that.data.stockCheckList;
    var emptyDATA = { parentvo: {}, childrenvo: {} };
    var DATA = (Object.keys(that.data.DATA).length > 0) ? that.data.DATA : emptyDATA;
    var stockList = [];
    // 获取用户选择的存货列表
    for(let i = 0; i < stockCheckList.length; i++) {
      for(let j = 0; j < itemsList.length; j++) {
        var obj = {};
        if(stockCheckList[i] == itemsList[j].parentvo.invcode) {
          obj.invname = itemsList[j].parentvo.invname;
          obj.measname = itemsList[j].parentvo.measname;
          obj.cinventoryid = itemsList[j].parentvo.invcode;
          stockList.push(obj);
        };
      };
    };
    DATA.stock = stockList;
    dd.setStorage({ key: 'DATA', data: JSON.stringify(DATA)});
    dd.showToast({ type: 'success', content: '添加成功' });
    setTimeout(() => { dd.hideToast(); dd.reLaunch({ url: '/pages/index/addNew/addNew' }); },2000);
  },
  onChange(e) {
    this.setData({ stockCheckList: e.detail.value });
  },
  getStockList(_stockList) {
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var userCode = getApp().globalData.U8C.usercode;
    var passWord = getApp().globalData.U8C.password;

    dd.httpRequest({
      headers: { "system": system, "usercode": userCode, "password": passWord },
      url: "http://"+port+"/u8cloud/api/uapbd/invbasdoc/query",
      method: "POST",
      data: JSON.stringify({}),
      dataType: 'json',
      success: res => {
        if(res && res.status == '200'){
          var stockData = JSON.parse(res.data.data).datas;
          var stockList = _stockList;
          var stockCheckList = that.data.stockCheckList;

          if(stockList && stockList.length > 0){
            // 将之前客户选中的存货勾选
            for(let i = 0; i < stockList.length; i++) {
              for(let j = 0; j < stockData.length; j++) {
                if(stockList[i].cinventoryid === stockData[j].parentvo.invcode) {
                  stockData[j].parentvo.checked = true;
                  stockCheckList.push(stockData[j].parentvo.invcode);
                };
              };
            };
          };
          that.setData({ stockCheckList: stockCheckList, items: stockData });
        };
      }
    });
  },
  onSearchBarTap(e) {
    dd.navigateTo({
      url: '/pages/search/stock/stock'
    })
  }
});
