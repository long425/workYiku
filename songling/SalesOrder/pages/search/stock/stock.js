Page({
  data: {
    searchVal: '',
    stockList: [],
    customName: '',
    haveStockList: [],
  },
  onLoad() {
    var that = this;
    // 获取已选择存货列表
    dd.getStorage({
      key: 'stockList',
      success: res => {
        if(res.data && res.data != ''){
          var stockList = JSON.parse(res.data);
          that.setData({
            haveStockList: stockList
          });
        };
      }
    });
    // 获取当前选择的客户
    dd.getStorage({
      key: 'customer',
      success: res => {
        that.setData({
          customName: JSON.parse(res.data).cusname
        });
      }
    })
  },
  // 
  onInput(e){
    var that = this;
    that.setData({
      searchVal: e
    });
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var customName = encodeURI(that.data.searchVal);
    // 利用正则表达式判断输入的类型
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    if(reg.test(that.data.searchVal)){
      // 输入的是数字
      var stock = '&code_begin=' + e + '&code_end=' + e; 
    }else{
      // 输入的不是数字
      var stock = '&name=' + encodeURI(e);
    };
    var params = '?from_account='+U8Data.from_account+'&to_account='+U8Data.to_account+'&app_key=' + U8Data.appKey + '&token=' + token + stock;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/inventory/batch_get' + params,
        method: 'GET',
        success: (res) => {
          that.setData({
            stockList: res.data.inventory
          });
        },
        fail: error => {
          console.log(error);
        }
      });
    }else {
      that.setData({
        searchVal: '',
        stockList: []
      });
    };
  },
  doneSearch(e){
    var that = this;
    that.setData({
      searchVal: e
    });
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var customName = encodeURI(that.data.searchVal);
    // 利用正则表达式判断输入的类型
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    if(reg.test(that.data.searchVal)){
      // 输入的是数字
      var stock = '&code_begin=' + e + '&code_end=' + e; 
    }else{
      // 输入的不是数字
      var stock = '&name=' + encodeURI(e);
    };
    var params = '?from_account='+U8Data.from_account+'&to_account='+U8Data.to_account+'&app_key=' + U8Data.appKey + '&token=' + token + stock;

    if(that.data.searchVal != '') {
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/inventory/batch_get' + params,
        method: 'GET',
        success: (res) => {
          that.setData({
            stockList: res.data.inventory
          });
        },
        fail: error => {
          console.log(error);
        }
      });
    }else {
      that.setData({
        searchVal: '',
        stockList: []
      });
    };
  },
  onCancel(){
    var that = this;
    that.setData({
      searchVal: '',
      stockList: []
    });
  },
  checkStock(e) {
    var that = this;
    var stockCode = e.target.dataset.code;
    var stockName = e.target.dataset.name;
    var haveStockList = that.data.haveStockList;
    var stockList = that.data.stockList;

    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var taxrate = getApp().globalData.taxrate;
    var customName = encodeURI(that.data.customName);
    var params = '?from_account=' +U8Data.from_account + '&to_account='+ U8Data.to_account + '&app_key='+ U8Data.appKey+'&token=' +token + '&ccusabbname=' + customName + '&cinvcode=' + stockCode;
    
    // 判断一选择存货列表中是否存在该存货
    var noStock = haveStockList.some(item => {
      if(item.inventorycode == stockCode) {
        dd.confirm({
          title: '存货已选择',
          content: '该存货已经添加过了，是否继续添加其他存货？',
          confirmButtonText: '添加',
          cancelButtonText: '返回订单页',
          success: (result) => {
            if(result.confirm == true){
              // 清空搜索框和搜索结果
              that.onCancel();
            }else{
              // 返回添加订单页
              dd.reLaunch({ url: '/pages/index/addNew/addNew' });
            };
          },
        });
        return true
      };
    });
    // 该存货不在已选择存货列表中时，将存货加入存货列表，并存入缓存。
    if(!noStock) {
      var stockObj = { inventoryname: '', inventorycode: '', unitname: '', quantity: '', unitprice: '', taxunitprice: '', money: '', sum: '' };
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/cuspricejust/batch_get' + params,
        method: 'GET',
        success: res => {
          if (res.data.errcode == '0') {
            stockObj.unitprice = Math.floor((res.data.cuspricejust[0].iinvnowcost) / (100 + taxrate) * 10000) / 100;
            stockObj.taxunitprice = Math.floor((res.data.cuspricejust[0].iinvnowcost) * 100) / 100;
          };
          console.log(stockList);
          stockList.forEach((item,index) => {
            if(item.code == stockCode){
              stockObj.inventoryname = item.name;
              stockObj.inventorycode = item.code;
              stockObj.unitname = item.ccomunitname;
            }
          });
          haveStockList.push(stockObj);

          dd.setStorage({
            key: 'stockList',
            data: JSON.stringify(haveStockList),
            success: () => {
              dd.confirm({
                title: '添加成功',
                content: '是否添加其他存货？',
                confirmButtonText: '继续添加',
                cancelButtonText: '返回订单',
                success: (result) => {
                  if(result.confirm == true){
                    // 清空搜索框和搜索结果
                    that.onCancel();
                  }else{
                    // 返回添加订单页
                    dd.reLaunch({ url: '/pages/index/addNew/addNew' });
                  };
                },
              });
            }
          });
        }
      });
    }; 
  }
});
