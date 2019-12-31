Page({
  data: {
    searchVal: '',
    stockList: [],
    oldStockList: [],
  },
  onLoad() {
    var that = this;
    // 获取已经选择的存货列表
    dd.getStorage({
      "key": "stockList",
      success: res => {
        var resData = JSON.parse(res.data);
        if(Object.keys(resData).length > 0){
          that.setData({oldStockList: resData});
        };
      }
    })
    this.getStockList();
  },
  onInput(e){
    var that = this;
    that.setData({searchVal: e});
    that.getStockList(e);
  },
  doneSearch(e){
    var that = this;
    that.setData({searchVal: e});
    that.getStockList(e);
  },
  onCancel(){
    var that = this;
    that.setData({ searchVal: '' });
     that.getStockList();
  },
  checkCustomer(e){
    var that = this;
    var stockCode = e.target.dataset.code;
    var stockList = that.data.stockList;
    var oldStockList = that.data.oldStockList;
    // 判断选择的存货是否已经选择过
    var noStock = oldStockList.some(item => {
      if(item.invcode == stockCode) {
        dd.confirm({
          title: '存货已选择',
          content: '是否继续添加其他存货？',
          confirmButtonText: '继续添加',
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
    if(!noStock){
      stockList.forEach(item => {
        if(item.parentvo.invcode == stockCode){
          oldStockList.push(item.parentvo);
        };
      });
      dd.setStorage({  key: "stockList", data: JSON.stringify(oldStockList) });
      dd.confirm({
          title: '存货添加成功',
          content: '是否继续添加其他存货？',
          confirmButtonText: '继续添加',
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
    };
  },
  getStockList(event){
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var usercode = getApp().globalData.U8C.usercode;
    var password = getApp().globalData.U8C.password;

    // var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    if (escape(that.data.searchVal).indexOf( "%u" ) < 0){   // 判断输入的是不是汉字
      var stock = JSON.stringify({"invcode": event});
    } else {
      var stock = JSON.stringify({"invname": event});
    }

    dd.httpRequest({
      headers: { "system": system, "usercode": usercode, "password": password },
      url: "http://"+port+"/u8cloud/api/uapbd/invbasdoc/query",
      method: "POST",
      data: stock,
      dataType: "json",
      success: res => {
        if(res.data.status === 'success'){
          var stockData = (JSON.parse(res.data.data).datas) ? JSON.parse(res.data.data).datas : [];
          that.setData({ stockList: stockData });
        }
      }
    });
  }
});
