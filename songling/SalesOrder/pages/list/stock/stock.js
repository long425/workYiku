Page({
  data: {
    stockCheckList: [],
    items: [
      // {name: 'angular',value: 'angular', inventoryname: 'angular', inventorycode: '', unitname: '', quantity: '', unitprice: '', taxunitprice: '', money: '', sum: '' },
      // {name: 'react', value: 'react', inventoryname: 'react', inventorycode: '', unitname: '', quantity: '', unitprice: '', taxunitprice: '', money: '', sum: '' },
      // {name: 'polymer',value: 'polymer', inventoryname: 'polymer', inventorycode: '', unitname: '', quantity: '', unitprice: '', taxunitprice: '', money: '', sum: '' },
      // {name: 'vue',value: 'vue', inventoryname: 'vue', inventorycode: '', unitname: '', quantity: '', unitprice: '', taxunitprice: '', money: '', sum: '' },
      // {name: 'ember',value: 'ember', inventoryname: 'ember', inventorycode: '', unitname: '', quantity: '', unitprice: '', taxunitprice: '', money: '', sum: '' },
      // {name: 'backbone',value: 'backbone', inventoryname: 'backbone', inventorycode: '', unitname: '', quantity: '', unitprice: '', taxunitprice: '', money: '', sum: '' }
    ],
    customerNameArr: []
  },
  onReady() {
    var that = this;
    dd.showLoading({
      content: '获取存货信息，请稍候...'
    });
    that.getAllStockList();
  },
  onChange(e) {
    var that = this;
    var stockList = e.detail.value;
    that.setData({
      stockCheckList: stockList
    });
  },
  // 获取全部存货列表
  getAllStockList() {
    var that = this;
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var params = '?from_account=' + U8Data.from_account + '&to_account=' + U8Data.to_account + '&app_key=' + U8Data.appKey + '&token=' + token;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/inventory/batch_get' + params,
      method: 'GET',
      success: res => {
        if (res.data.errcode == '0') {
          dd.hideLoading();
          var allStockList = res.data.inventory;
          var stockCheckList = that.data.stockCheckList;
          dd.getStorage({
            key: 'stockList',
            success: res => {
              if(res.data && res.data != ''){
                var stockList = JSON.parse(res.data);
                for (let i = 0; i < stockList.length; i++) {
                  for (let j = 0; j < allStockList.length; j++) {
                    if (stockList[i].inventoryname == allStockList[j].name) {
                      allStockList[j].checked = true;
                      stockCheckList.push(allStockList[j].code);
                    };
                  };
                };
              };
              that.setData({
                stockCheckList: stockCheckList,
                items: allStockList
              });
            }
          });
        }
      }
    });
  },
  addStockList(e) {
    var that = this;
    var itemsList = that.data.items;
    var stockCheckList = that.data.stockCheckList;
    var stockList = [];
    // 获取用户选择的存货列表
    for (let i = 0; i < stockCheckList.length; i++) {
      for (let j = 0; j < itemsList.length; j++) {
        var stockObj = { inventoryname: '', inventorycode: '', unitname: '', quantity: '', unitprice: '', taxunitprice: '', money: '', sum: '' };
        if (stockCheckList[i] == itemsList[j].code) {
          stockObj.inventoryname = itemsList[j].name;
          stockObj.inventorycode = itemsList[j].code;
          stockObj.unitname = itemsList[j].ccomunitname;
          stockList.push(stockObj);
        };
      };
    };

    dd.getStorage({
      key: 'customer',
      success: res => {
        if (res.data && res.data != '') {
          var token = getApp().globalData.token;
          var U8Data = getApp().globalData.U8;
          var customName = JSON.parse(res.data).cusname;
          var taxrate = getApp().globalData.taxrate;
          stockList.forEach(function (item, index) {
            var params = '?from_account=' + U8Data.from_account + '&to_account=' + U8Data.to_account + '&app_key=' + U8Data.appKey + '&token=' + token + '&ccusabbname=' + encodeURI(customName) + '&cinvcode=' + item.inventorycode;
            dd.httpRequest({
              url: 'https://api.yonyouup.com/api/cuspricejust/batch_get' + params,
              method: 'GET',
              success: res => {
                if (res.data.errcode == '0') {
                  item.unitprice = Math.floor((res.data.cuspricejust[0].iinvnowcost) / (100 + taxrate) * 10000) / 100;
                  item.taxunitprice = Math.floor((res.data.cuspricejust[0].iinvnowcost) * 100) / 100;
                };
                // 将选择的存货存入本地
                dd.setStorage({
                  key: 'stockList',
                  data: JSON.stringify(stockList)
                });

               setTimeout(() => {
                 dd.reLaunch({
                   url: '/pages/index/addNew/addNew'
                 });
               }, 2000);
              }
            })
          });
        }
      }
    });


  },


  onSearchBarTap(e) {
    dd.navigateTo({
      url: '/pages/search/stock/stock'
    })
  }
});
