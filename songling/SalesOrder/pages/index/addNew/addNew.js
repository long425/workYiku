Page({
  data: {
    addFlag: true,
    company: {
      cusname: '',cuscode: '',deptname: '',deptcode: ''
    },
    // 预发货日期-送货地址-联系人-税率-整单金额
    orderHeader: {
      dpredatebt: '', sendaddress: '', ccusperson: '', taxrate: 16, sum: ''
    },
    stockList: [
      // 存货名称-存货代码-销售单位-数量-无税单价-含税单价-无税金额-价税合计
      // { inventoryname: '第一', inventorycode: '01', unitname: 'pcs', quantity: 3, unitprice: '', taxunitprice: '', money: '', sum: '' },
    ]
  },
  // 页面加载中
  onLoad(options) {
    let that = this;
    dd.showLoading({
      content: '页面加载中，请稍候...',
    });
    that.getToken();
    that.getUserDingInfo();

    // 从缓存中获取客户
    dd.getStorage({
      key: "customer",
      success: res => {
        let company = that.data.company;
        if(res.data && res.data != ''){
          let custom = JSON.parse(res.data);
          company.cusname = custom.cusname;
          company.cuscode = custom.cuscode;
          that.setData({
            company: company
          });
        };
      }
    });
    // 从缓存中获取部门
    dd.getStorage({
      key: 'branch',
      success: res => {
        let company = that.data.company;
        if(res.data && res.data != ''){
          let branch = JSON.parse(res.data);
          company.deptname = branch.deptname;
          company.deptcode = branch.deptcode;
          that.setData({
            company: company
          });
        };
      }
    });

    // 从缓存中获取订单表头
    dd.getStorage({
      key: 'headerData',
      success: res => {
        if(res.data && res.data != ''){
          var allMoney = 0;
          var stockList = that.data.stockList;
          var orderHeader = JSON.parse(res.data);

          // 计算整单金额
          stockList.forEach(function(item,index){ if(item.sum){allMoney += parseFloat(item.sum)}; return allMoney; });
          
          // 给整单金额赋值
          orderHeader.sum = allMoney;

          // 给标头数据赋值
          that.setData({
            orderHeader: orderHeader
          });
        };
      }
    });

    // 从缓存中获取订单行列表
    dd.getStorage({
      key: 'stockList',
      success: res => {
        if(res.data && res.data != ''){
          that.setData({
            stockList: JSON.parse(res.data)
          });
        };
      },
      fail: error => {}
    });
  },
  // 页面加载完成
  onReady() {
    var that = this;
    // dd.showLoading({
    //   content: '页面加载中，请稍候...',
    // });
  },
  // 跳转选择客户
  getCustom() {
    dd.navigateTo({
      url: '/pages/list/customers/customers'
    });
  },
  // 跳转选择部门 
  getBranch() {
    dd.navigateTo({
      url: '/pages/list/branch/branch'
    });
  },
  // 选择预发货日期
  showDateTime(e) {
    var that = this;
    dd.datePicker({
      format: 'yyyy-MM-dd',
      startDate: '2019-01-01',
      endDate: '2119-01-01',
      success: (res) => {
        if(res.date){
          var orderHeader = that.data.orderHeader;
          orderHeader.dpredatebt = res.date;
          that.setData({
            orderHeader: orderHeader
          });
        };
      },
      fail: error => {
        console.log(error);
      }
    });
  },
  // 添加新的订单明细行
  addNew() {
    var that = this;
    if(that.data.company.cusname == ''){
      dd.showToast({
        type: 'fail',
        content: '请先选择客户',
        duration: 2000
      });
      return;
    };

    dd.navigateTo({
      url: '/pages/list/stock/stock'
    });
  },
  // 删除一个明细行
  deleteOrder(e) {
    var that = this;
    var thisClickIndex = e.currentTarget.id;      // 点击订单的索引
    var orderHeader = that.data.orderHeader;      // 订单表头
    var stockList = that.data.stockList;          // 订单明细存货列表
    var allMoney = 0;                             // 订单所有金额总和
    // 提示弹窗
    dd.confirm({
      title: '温馨提示',
      content: '是否想要删除订单明细（' + (thisClickIndex+1) + '）',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      success: (result) => {
        if(result.confirm) {
          // 删除订单明细行
          stockList.splice(thisClickIndex,1);

          // 计算订单所有明细行的金额总和
          stockList.forEach(function(item,index){ allMoney += parseFloat(item.sum); return allMoney; });

          orderHeader.sum = allMoney;
           
          // 更新订单数据
          that.setData({
            stockList: stockList,
            orderHeader: orderHeader
          });

          // 将改变后的订单存入本地
          dd.setStorage({
            key: 'stockList',
            data: JSON.stringify(stockList)
          });
        };
      },
    });
  },
  // 修改销售订单表头
  changeHeaderValue(e) {
    var that = this;
    var orderHeader = that.data.orderHeader;
    var dataName = e.currentTarget.dataset.name;
    // 更新表头数据    
    orderHeader[dataName] = e.detail.value;
    that.setData({
      orderHeader: orderHeader
    });
    if(dataName == 'taxrate'){
      that.setData({
        'getApp().globalData.taxrate': e.detail.value
      });
      getApp().globalData.taxrate = e.detail.value;
    };
    // 将标头数据存入缓存
    dd.setStorage({
      key: "headerData",
      data: JSON.stringify(orderHeader)
    });
  },
  // 修改销售订单订单明细行
  changeStockValue(e) {
    var that = this;
    var allMoney = 0;
    var taxrate = parseFloat(that.data.orderHeader.taxrate);      // 税率
    
    var stockList = that.data.stockList;              // 订单表头
    var orderHeader = that.data.orderHeader;          // 订单明细存货列表

    var dataName = e.currentTarget.dataset.name;      // 修改的明细行内容
    var changeIndex = e.currentTarget.dataset.hi;     // 修改的明细行索引

    switch(dataName) {
      case 'quantity':            // 数量
        stockList[changeIndex].quantity = e.detail.value;
        if(stockList[changeIndex].quantity != '' && stockList[changeIndex].taxunitprice != ''){
          stockList[changeIndex].money = Math.floor(parseFloat(stockList[changeIndex].quantity)*parseFloat(stockList[changeIndex].unitprice)*100)/100;
          stockList[changeIndex].sum = Math.floor(parseFloat(stockList[changeIndex].quantity)*parseFloat(stockList[changeIndex].taxunitprice)*100)/100;
        };
        break;
      case 'unitprice':           // 无税单价
        stockList[changeIndex].unitprice =  e.detail.value;
        stockList[changeIndex].taxunitprice = (stockList[changeIndex].unitprice) ? Math.floor(parseFloat(stockList[changeIndex].unitprice)*(100 + taxrate))/100 : '';

        if(stockList[changeIndex].quantity != '' && stockList[changeIndex].unitprice != ''){
          stockList[changeIndex].money = Math.floor(parseFloat(stockList[changeIndex].quantity)*parseFloat(stockList[changeIndex].unitprice)*100)/100;
          stockList[changeIndex].sum =  Math.floor(parseFloat(stockList[changeIndex].quantity)*parseFloat(stockList[changeIndex].taxunitprice)*100)/100;
        }
        break;
      case 'taxunitprice':        // 含税单价
        stockList[changeIndex].taxunitprice =  e.detail.value;
        stockList[changeIndex].unitprice = (stockList[changeIndex].taxunitprice) ? Math.floor(parseFloat(stockList[changeIndex].taxunitprice)/(100 + taxrate)*10000)/100 : '';

        if(stockList[changeIndex].quantity != '' && stockList[changeIndex].taxunitprice != ''){
          stockList[changeIndex].money = Math.floor(parseFloat(stockList[changeIndex].quantity)*parseFloat(stockList[changeIndex].unitprice)*100)/100;
          stockList[changeIndex].sum =  Math.floor(parseFloat(stockList[changeIndex].quantity)*parseFloat(stockList[changeIndex].taxunitprice)*100)/100;
        };
    };
    // 订单明细行中'数量'，'无税单价','含税单价'任何一个为空值，该明细行'无税金额'，'价税合计'为0或空
    if(stockList[changeIndex].quantity == '' || stockList[changeIndex].unitprice == '' || stockList[changeIndex].taxunitprice == '') {
      stockList[changeIndex].money = '';
      stockList[changeIndex].sum = '';
    };

    // 计算每个明细行的价税合计的总和
    stockList.forEach(function(item,index){ 
      if(item.sum) {
        allMoney += parseFloat(item.sum); 
      };
      return allMoney; 
    });
    orderHeader.sum = allMoney;
    that.setData({
      orderHeader: orderHeader,
      stockList: stockList
    });
  },


  /* *
  * *
  * 获取全局参数
  * *
  * */

  // 获取全局唯一识别码Token
  getToken() {
    // do something
    var that = this;
    var U8Data = getApp().globalData.U8;
    var params = '?from_account=' + U8Data.from_account + '&app_key=' + U8Data.appKey + '&app_secret=' + U8Data.appSecret;
    dd.httpRequest({
      url: 'https://api.yonyouup.com/system/token' + params,
      method: 'GET',
      success: res => {
        if(res.data.errcode == 0){
          that.setData({
            'getApp().globalData.token': res.data.token.id
          })
          getApp().globalData.token = res.data.token.id;
          // 获取唯一交易码
          that.getTradeid(res.data.token.id);
          that.getCustomAndPrice(res.data.token.id);
        }else {
          dd.showToast({
            type: 'fail',
            content: '客户端未登录',
            duration: 3000
          })
        }
      }
    })
  },
  // 获取交易号
  getTradeid(_token){
    var that = this;
    var U8Data = getApp().globalData.U8;
    var params = '?from_account=' + U8Data.from_account + '&app_key=' + U8Data.appKey + '&token=' + _token;
    dd.httpRequest({
      url: 'https://api.yonyouup.com/system/tradeid' + params,
      method: 'GET',
      success: res => {
        if(res.data.errcode == '0'){
          that.setData({
            'getApp().globalData.tradeid': res.data.trade.id
          });
          getApp().globalData.tradeid = res.data.trade.id;
        }
        dd.hideLoading();
      }
    });
  },


  /* 
  * * 
  * * 获取员工钉钉信息
  * *
  */
  getUserDingInfo(){
    var that = this;
    var authCode = '';
    var DData = getApp().globalData.DD;
    var accessToken;
    // 1.获取免登授权码
    dd.getAuthCode({
      success: res => { 
        authCode = res.authCode; 
      }
    });
    // 2. 获取access_token
    dd.httpRequest({
      url: 'https://oapi.dingtalk.com/gettoken?appkey=' + DData.appKey + '&appsecret=' + DData.appSecret,
      method: 'GET',
      success: res => {
        if(res.data.errcode == '0') {
          accessToken = res.data.access_token;

          // 2.1  获取UserId 
          dd.httpRequest({
            url: 'https://oapi.dingtalk.com/user/getuserinfo?access_token=' + accessToken + '&code=' + authCode,
            method: 'GET',
            success: res => {
              if(res.data.errcode == '0'){
                var userDingInfoData = res.data;
                // 根据员工ID获取工号
                dd.httpRequest({
                  url: 'https://oapi.dingtalk.com/user/get?access_token=' + accessToken + '&userid=' +  userDingInfoData.userid,
                  method: 'GET',
                  success: result => {
                    if(result.data.errcode == '0') {
                      dd.setStorage({ key: 'jobNumber', data: result.data.jobnumber });
                    };
                  }
                });
              };
            },
            fail: error => {
              console.log(error)
            }
          });
        };
      }
    });
  },




  // 获取客户不同存货的历史调价单
  getCustomAndPrice(token) {
    var that = this;
    var taxrate = getApp().globalData.taxrate;
    var stockList = that.data.stockList;
    var customName = that.data.company.cusname;

    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    if(stockList && stockList.length > 0){
      stockList.forEach(item => {
        var params = '?from_account='+U8Data.from_account+'&to_account='+U8Data.to_account+'&app_key='+U8Data.appKey+'&token='+token+'&ccusabbname='+encodeURI(customName)+'&cinvcode=' + item.inventorycode;

        dd.httpRequest({
          url: 'https://api.yonyouup.com/api/cuspricejust/batch_get' + params,
          method: 'GET',
          success: res => {
            if(res.data.errcode == '0') {
              item.unitprice = Math.floor((res.data.cuspricejust[0].iinvnowcost) / (100 + taxrate) * 10000) / 100;  // 无税单价
              item.taxunitprice = Math.floor((res.data.cuspricejust[0].iinvnowcost) * 100) / 100;       // 含税单价
              item.money = (Math.floor((res.data.cuspricejust[0].iinvnowcost) / (100 + taxrate) * 10000) / 100) * item.quantity;    // 无税金额
              item.sum = (Math.floor((res.data.cuspricejust[0].iinvnowcost) * 100) / 100) * item.quantity;        // 价税合计
            }else if(res.data.errcode == '20002'){
              item.unitprice ='';  // 无税单价
              item.taxunitprice = '';       // 含税单价
              item.money = '';    // 无税金额
              item.sum = '';        // 价税合计
            };
            that.setData({ stockList: stockList });
          }
        });
      });
    };
  },
  // 提交新的销售订单
  addNewSaleOrder() {
    var that = this;
    var addFlag = true;
    var token = getApp().globalData.token;
    var tradeId = getApp().globalData.tradeid;
    var U8Data = getApp().globalData.U8;

    var params = '?from_account='+ U8Data.from_account+'&to_account='+U8Data.to_account+'&app_key='+U8Data.appKey+'&token='+token+'&tradeid='+tradeId;

    if(that.data.addFlag){
      that.setData({ addFlag: false });
      console.log(that.data.company)
      if(!that.data.company.cuscode) { dd.showToast({ type: 'fail', content: '请先选择销售订单客户', duration: 2000 }); return };   // 客户必填
      if(!that.data.company.deptcode) { dd.showToast({ type: 'fail', content: '请先选择销售订单部门', duration: 2000 }); return };   // 部门必填
      var nowTime = new Date(new Date().toLocaleDateString().replace(/(\/)/g,'-')).getTime();       // 当前订单日期
      var dpredatebt = new Date(that.data.orderHeader.dpredatebt).getTime();            // 销售订单预发货日期
      if(nowTime > dpredatebt){ dd.showToast({ type: 'fail', content: '预发货日期不能小于订单日期',duration: 2000 }); return };    // 预发货日期不能小于订单日期
      if(that.data.stockList.length <= 0) { dd.showToast({ type: 'fail', content: '请添加销售订单存货', duration: 2000 }); return };     // 存货必填
      for(let i = 0; i < that.data.stockList.length; i++){     // 循环检查所有的订单  // 存货数量必填
        if(!that.data.stockList[i].quantity){ dd.showToast({type: 'fail', content: '请先填写订单['+ (i+1) +']的销售存货数量', duration: 2000 }); return };
      };

      // 检查完毕，提交订单
      dd.httpRequest({
        headers: { "Content-Type": "application/json" },
        url: 'https://api.yonyouup.com/api/saleorder/add' + params,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
          "saleorder": {
            "custcode": that.data.company.cuscode,
            "deptcode": that.data.company.deptcode,
            "ccusperson": that.data.orderHeader.ccusperson,
            "sendaddress": that.data.orderHeader.sendaddress,
            "dpredatebt": that.data.orderHeader.dpredatebt,
            "sum": that.data.orderHeader.sum,
            "taxrate": that.data.orderHeader.taxrate,
            "typecode": "1",
            "entry": that.data.stockList
          }
        }),
        success: res => {
          // 等待7s后请求真正的返回结果
          setTimeout(() => {
            dd.httpRequest({
              url: res.data.url,
              method: 'GET',
              success: result => {
                if(result.data.errcode == '0') {
                  that.setData({ addFlag: true });
                  dd.showToast({ type: 'success', content: '添加销售订单成功', duration: 2000 });

                  setTimeout(() => {
                    dd.setStorage({ key: 'customer', data: '' });
                    dd.setStorage({ key: 'branch', data: '' });
                    dd.setStorage({ key: 'headerData', data: '' });
                    dd.setStorage({ key: 'stockList', data: '' });

                    dd.reLaunch({
                      url: '/pages/index/orderList/orderList'
                    });
                  },3000);
                };
              }
            });
          },7000);
        }
      });  
    };
  }
});
