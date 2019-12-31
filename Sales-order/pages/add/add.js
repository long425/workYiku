import debounce from '/util/debounce';
Page({
  data: {
    branchArr: [],                      // 部门列表
    custcode: '',                       // 客户编码
    custname: '',                       // 客户名称
    deptcode: '',                       // 部门编码
    ccusperson: '',                     // 联系人
    sendaddress: '',                    // 发货地址
    dpredatebt: '',                     // 预发货日期
    taxrate: 16,                        // 税率
    sum: '',                            // 价税合计
    orderLen: [{
      inventorycode: '',                // 存货编码
      inventoryname: '',                // 存货名字
      unitname: '',                     // 销售单位
      quantity: '',                     // 数量
      num: '',                          // 件数
      unitprice: '',                    // 无税单价
      taxunitprice: '',                 // 含税单价
      money: '',                        // 无税金额
      sum: '',                          // 价税合计
    }],
    currentIndex: '',                   // 点前点击订单索引
    /*
    * // 弹出框内的相关数据
    */ 
    stockArr: [],                       // 存货列表
    stockSearchValue: '',               // 搜索存货的值
    stockSearchResult: [],               // 搜索存货列表
    stockSearchCancelIsShow: false,     // 是否显示搜索存货取消按钮
    noStock: false,                     // 是否显示没有存货时的提示内容
    
  },
  // 页面加载完成
  onReady(option){
    var that = this;
    dd.getStorage({
      key: 'currentCustomer',
      success: res => {
        if(res.data){
          that.setData({
            custcode: res.data.customerCode,
            custname: res.data.customerName
          });
        };
      }
    });
    that.getToken();
    that.getResponInfo();
  },
  // 选中一个部门
  bindObjPickerChange(e) {
    var that = this;
    var branchList = that.data.branchArr;
    that.setData({
      arrIndex: e.detail.value,
      deptcode: branchList[e.detail.value].code
    });
  },
  // 添加一个订单详情页
  addNew(){
    var that = this;
    var oldArr = that.data.orderLen;
    // 添加对象内容：销售类型/存货编码/存货名称/销售单位/数量/件数/含税单价/无税单价/含税金额/无税金额
    var newObj = {typecode:'1',inventorycode:'',inventoryname:'',unitname:'',quantity:'',num:'',taxunitprice:'',unitprice:'',sum:'',money:''}
    oldArr.push(newObj)     // 放进订单数组
    that.setData({
      orderLen: oldArr // 更新数据
    })
  },
  // 删除一张订单详情页
  deleteOrder: function(idx){
    var that = this;
    dd.confirm({
      content: '确定要删除订单明细(' + (idx.currentTarget.id + 1) + ')吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if(result.confirm){
          var thisIndex = idx.currentTarget.id;   // 判断当前点击的是哪一个订单
          var oldArr = that.data.orderLen; // 查看当前订单数组
          var allMoney = 0;      // 所有明细行的价税合计
          oldArr.splice(thisIndex,1);                 // 将点击的订单明细删除
          oldArr.forEach(function(item,index){        // 重新计算整单金额
            allMoney += parseFloat(item.sum);
            return allMoney;
          });
          that.setData({
            orderLen: oldArr,
            sum: allMoney
          });
        };
      }
    });

  },
  // 销售订单表头修改
  changeHeaderValue(e){
    var that = this;
    var taxrate = that.data.taxrate;
    var dataName = e.currentTarget.dataset.name;
    switch(dataName) {
      case 'ccusperson':
        that.setData({
          ccusperson: e.detail.value
        });
        break;
      case 'sendaddress':
        that.setData({
          sendaddress: e.detail.value
        });
        break;
      case 'dpredatebt':
        that.setData({
          dpredatebt: e.detail.value
        });
        break;
      case 'taxrate':
        that.setData({
          taxrate: e.detail.value
        });
        break;
      case 'sum':
        that.setData({
          sum: e.detail.value
        });
    }; 
  },
  // 销售订单订单行修改事件
  changeValueData(idx){
    var that = this;
    var nowData = idx.detail.value.replace(/[^\d]/g,'');
    var oldArr = that.data.orderLen;
    var taxrate = that.data.taxrate;
    oldArr[idx.currentTarget.dataset.hi][idx.currentTarget.dataset.name] = idx.detail.value;
    that.setData({
      orderLen: oldArr
    });
    var appKey = getApp().globalData.appKey_U8;
    var token = getApp().globalData.token;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key='+ appKey +'&token=' + token + '&id=' + idx.detail.value
    // 如果填写的是存货编码选项，填好存货编码后获取存货名称并填写
    if(idx.currentTarget.dataset.name == 'inventorycode'){
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/inventory/get' + params,
        method: 'GET',
        async: false,
        success: (res) => {
          var needData = res.data.inventory;
          if(res.data.errcode == '0') {
            oldArr[idx.currentTarget.dataset.hi].inventoryname = needData.name;
            oldArr[idx.currentTarget.dataset.hi].unitname = needData.ccomunitname;
            that.setData({
              orderLen: oldArr
            });
          }
        }
      });
    };
    // 修改的是'数量'
    if(idx.currentTarget.dataset.name == 'quantity') {
      if(oldArr[idx.currentTarget.dataset.hi].quantity && oldArr[idx.currentTarget.dataset.hi].taxunitprice){
        // 无税金额
        oldArr[idx.currentTarget.dataset.hi].money = Math.floor(parseFloat(oldArr[idx.currentTarget.dataset.hi].quantity)*parseFloat(oldArr[idx.currentTarget.dataset.hi].unitprice)*100)/100;
        // 含税金额
        oldArr[idx.currentTarget.dataset.hi].sum =  Math.floor(parseFloat(oldArr[idx.currentTarget.dataset.hi].quantity)*parseFloat(oldArr[idx.currentTarget.dataset.hi].taxunitprice)*100)/100;
      };
      var allMoney = 0;
      for(let i = 0; i < oldArr.length; i++){
        allMoney += parseFloat(oldArr[i].sum);
      };
      that.setData({
        orderLen: oldArr,
        sum: allMoney
      });      
    };

    // 修改的是'无税单价'
    if(idx.currentTarget.dataset.name == 'unitprice'){
      // 含税单价 = 无税单价*税率 + 无税单价
      oldArr[idx.currentTarget.dataset.hi].taxunitprice =  Math.floor(parseFloat(oldArr[idx.currentTarget.dataset.hi].unitprice)*(1 + taxrate/100)*100)/100;
      if(oldArr[idx.currentTarget.dataset.hi].unitprice == ''){
         oldArr[idx.currentTarget.dataset.hi].taxunitprice = '';
      };
        // '数量'和'无税单价'都不为空
      if(oldArr[idx.currentTarget.dataset.hi].quantity && oldArr[idx.currentTarget.dataset.hi].unitprice){
        // 无税金额
        oldArr[idx.currentTarget.dataset.hi].money = Math.floor(parseFloat(oldArr[idx.currentTarget.dataset.hi].quantity)*parseFloat(oldArr[idx.currentTarget.dataset.hi].unitprice)*100)/100;
        // 含税金额
        oldArr[idx.currentTarget.dataset.hi].sum =  Math.floor(parseFloat(oldArr[idx.currentTarget.dataset.hi].quantity)*parseFloat(oldArr[idx.currentTarget.dataset.hi].taxunitprice)*100)/100;
      };
      // 整单金额
      var allMoney = 0;
      for(let i = 0; i < oldArr.length; i++){
        allMoney += parseFloat(oldArr[i].sum);
      };
      that.setData({
        orderLen: oldArr,
        sum: allMoney
      });      
    };

    // 修改的是'含税单价'
    if(idx.currentTarget.dataset.name == 'taxunitprice') {
      // 含税单价改变----修改无税单价
      oldArr[idx.currentTarget.dataset.hi].unitprice = parseFloat(oldArr[idx.currentTarget.dataset.hi].taxunitprice)/(1 + taxrate/100);
      if(oldArr[idx.currentTarget.dataset.hi].taxunitprice == ''){
        oldArr[idx.currentTarget.dataset.hi].unitprice = ''
      }
      // 判断'存货数量'*'含税单价'，是否为数字
      if(oldArr[idx.currentTarget.dataset.hi].quantity && oldArr[idx.currentTarget.dataset.hi].taxunitprice){
       // 无税金额
        oldArr[idx.currentTarget.dataset.hi].money = Math.floor(parseFloat(oldArr[idx.currentTarget.dataset.hi].quantity)*parseFloat(oldArr[idx.currentTarget.dataset.hi].unitprice)*100)/100;
        // 含税金额
        oldArr[idx.currentTarget.dataset.hi].sum =  Math.floor(parseFloat(oldArr[idx.currentTarget.dataset.hi].quantity)*parseFloat(oldArr[idx.currentTarget.dataset.hi].taxunitprice)*100)/100;
      };
      // 整单金额
      var allMoney = 0;
      for(let i = 0; i < oldArr.length; i++){
        allMoney += parseFloat(oldArr[i].sum);
      };
      that.setData({
        orderLen: oldArr,
        sum: allMoney
      });
    };
  },
  // 提交销售订单
  addOrder(){
    var that = this;
    var _token = getApp().globalData.token;
    var _tradeid = getApp().globalData.tradeid;
    if(!that.data.custcode){      // 没填客户名称时
      dd.showToast({type: 'fail',content: '请先选择客户',duration: 1500,});
      return
    };
    if(!that.data.deptcode){      // 没填部门时
      dd.showToast({type: 'fail',content: '请先选择部门',duration: 1500,});
      return
    };
    for(let i = 0; i < that.data.orderLen.length; i++){     // 循环检查所有的订单
      if(!that.data.orderLen[i].inventorycode){
        dd.showToast({type: 'fail',content: '请先选择订单['+ (i+1) +']存货',duration: 1500,});
        return
      };
      if(!that.data.orderLen[i].quantity){
        dd.showToast({type: 'fail',content: '请先填写订单['+ (i+1) +']数量',duration: 1500,});
        return
      };
    };
    var appKey = getApp().globalData.appKey_U8;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + _token + '&tradeid=' + _tradeid;
    // 通过上面的检查后，请求添加订单
    dd.httpRequest({
      headers: {
        "Content-Type": "application/json"
      },
      url: 'https://api.yonyouup.com/api/saleorder/add' + params,
      method: 'POST',
      data:JSON.stringify({
        "saleorder": {
          "custcode": that.data.custcode,
		      "deptcode": that.data.deptcode,
          "ccusperson": that.data.ccusperson,
          "sendaddress": that.data.sendaddress,
          "dpredatebt": that.data.dpredatebt,
          "sum": that.data.sum,
          "typecode": '1',
          "entry": that.data.orderLen
        }
      }),
      dataType: 'json',
      success: function(res){
        // 3秒后在发送请求，获取真正的返回结果
        setTimeout(function(){
          dd.httpRequest({
            url: res.data.url,
            method: 'GET',
            success: result => {
              if(result.data.errcode == '0'){
                dd.showToast({
                  type: 'success',
                  content: '添加订单成功',
                  duration: 1500
                });

                /*
                * 销售订单提交成功后，清楚之前的订单数据
                */
                //  第一步，清楚本地客户缓存
                dd.setStorage({
                  key: 'currentCustomer',
                  value: ''
                });

                // 第二步，删除多余的销售订单明细行，并且清空明细行里面的所有值
                var orderDetail = [{inventorycode: '',inventoryname: '',unitname: '',quantity: '',num: '',taxunitprice: '',sum: ''}];
                that.setData({
                  orderLen: orderDetail,
                  custcode: '',
                  custname: '',
                  deptcode: '',
                  ccusperson: '',
                  sendaddress: '',
                  dpredatebt: '',
                  money: '',
                  sum: ''
                })
              };
            }
          });
        },3000);
      }
    });
  },
  // 获取存货信息
  getStock(e){
    var that = this;
    var appKey = getApp().globalData.appKey_U8;
    var token = getApp().globalData.token;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + '&sort_code=01';
    // 获取焦点时，请求存货列表
    if(that.data.stockArr.length == 0){
      /*
      * sort_code      所属分类
      */ 
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/inventory/batch_get' + params,
        async: false,
        method: 'GET',
        success: (res) => {
          var _stockArr = res.data.inventory;
          for(var i = 0;i < res.data.inventory.length; i++) {
            _stockArr[i].hi = e.currentTarget.dataset.hi;
          };
          that.setData({
            stockArr: _stockArr,
            modelIsShow: true,
            currentIndex: e.currentTarget.dataset.hi
          });
        }
      });
    }else{
      that.setData({
        modelIsShow: true,
        currentIndex: e.currentTarget.dataset.hi
      })
    }
  },
  // 选择存货并关闭弹窗
  checkStock(e){
    var that = this;
    var code = e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.name;
    var unit = e.currentTarget.dataset.unit;
    var idx = e.currentTarget.dataset.hi;

    var orderArr = that.data.orderLen;
    orderArr[idx].inventorycode = code;
    orderArr[idx].inventoryname = name;
    orderArr[idx].unitname = unit
    that.setData({
      orderLen: orderArr,
      modelIsShow: false,
      stockSearchValue: '',
      stockSearchResult: [],
      stockSearchCancelIsShow: false
    })
  },
  getToken(){
    var that = this;
    var appKey = getApp().globalData.appKey_U8;
    var appSecret = getApp().globalData.appSecret_U8;
    var params = '?from_account=ZJYiKu&app_key=' + appKey + '&app_secret=' + appSecret
    dd.httpRequest({
      url:'https://api.yonyouup.com/system/token' + params,
      method: 'GET',
      success:function(res){
        if(res.data.errcode == 0){
          that.setData({
            'getApp().globalData.token': res.data.token.id
          })
          getApp().globalData.token = res.data.token.id;

          // 获取部门列表
          that.getBranch(res.data.token.id);

          // 获取唯一交易码
          that.getTradeid(res.data.token.id)
        }
      }
    });
  },
  // 获取部门列表
  getBranch(_token){
    var that = this;
    var appKey = getApp().globalData.appKey_U8;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key='+ appKey +'&token=' + _token
    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/department/batch_get'+ params,
      method: 'GET',
      success: res => {
        var branch = res.data.department;
        var newArr = [];
        if(branch){
          for(var i = 0; i< branch.length; i++) {
            var brObj = {
              id: branch[i].RowNum,
              name: branch[i].name,
              code: branch[i].code
            }
            newArr.push(brObj);
          };
          that.setData({
            branchArr: newArr
          });
        };
      }
    });
  },
  // 获取交易号
  getTradeid(_token){
    var that = this;
    var appKey = getApp().globalData.appKey_U8;
    var params = '?from_account=ZJYiKu&app_key=' + appKey + '&token=' + _token;
    dd.httpRequest({
      url: 'https://api.yonyouup.com/system/tradeid' + params,
      method: 'GET',
      success: res => {
        that.setData({
          'getApp().globalData.tradeid': res.data.trade.id
        })
        getApp().globalData.tradeid = res.data.trade.id
      }
    });
  },
  // 获取客户
  getCustom(){
    dd.navigateTo({
      url: '/pages/customer/customer'
    })
  },

  /*
  * 弹出窗内的搜索内存相关事件
  */

  // 存货搜索框获取焦点时触发的事件，让取消按钮显示
  showStockSearchCancel(){
    var that = this;
    that.setData({
      stockSearchCancelIsShow: true
    })
  },
  // 存货搜索框失去焦点时触发的事件  内容为空时，隐藏取消按钮
  hideStockSearchCancel(){
    var that = this;
    if(that.data.stockSearchValue == '') {
      that.setData({
        stockSearchCancelIsShow: false
      });
    };
  },
  // 点击取消按钮触发的事件：清空搜索框输入内容/清空搜索存货结果
  cancelSearchStock(){
    var that = this;
    that.setData({
      stockSearchValue: '',
      stockSearchResult: [],
      stockSearchCancelIsShow: false
    });
  },
  // 存货搜索框输入事件：
  stockSearchInput(e){
    var that = this;
    that.setData({
      stockSearchValue: e.detail.value
    });
    // 验证输入的是否是数字的正则表达式
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    var paramName = '';
    var paramVal = '';
    // 利用正则表达式判断输入的是数字还是文字
    if(reg.test(that.data.stockSearchValue)){
      // 输入的是数字
      paramName = '&code_begin=' + e.detail.value + '&code_end=' + e.detail.value; 
    }else{
      // 输入的不是数字
      paramName = '&name=' + encodeURI(e.detail.value);
    };
    that.setData({
      stockResultIsShow: true
    });
    var appKey = getApp().globalData.appKey_U8;
    var token = getApp().globalData.token;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + paramName;
    if(that.data.stockSearchValue != ''){
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/inventory/batch_get' + params,
        method: 'GET',
        success: res => {
          if(res.data.errcode == '0') {
            that.setData({
              stockSearchResult: res.data.inventory,
              noStock: false
            });
          }else{
            that.setData({
              noStock: true,
              stockSearchResult: []
            });
          };
        }
      });
    }else{
      that.setData({
        stockSearchResult: [],
        stockResultIsShow: false
      });
    };
  },
  // 存货搜索框输入完成事件：
  stockSearchDone(e){
    var that = this;
    that.setData({
      stockSearchValue: e.detail.value
    });
    // 验证输入的是否是数字的正则表达式
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    var paramName = '';
    var paramVal = '';
    // 利用正则表达式判断输入的是数字还是文字
    if(reg.test(that.data.stockSearchValue)){
      // 输入的是数字
      paramName = '&code_begin=' + e.detail.value + '&code_end=' + e.detail.value; 
    }else{
      // 输入的不是数字
      paramName = '&name=' + encodeURI(e.detail.value);
    };
    var appKey = getApp().globalData.appKey_U8;
    var token = getApp().globalData.token;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token + paramName;
    if(that.data.stockSearchValue == ''){
      that.setData({
        noStock: false,
        stockSearchResult: []
      });
    }else{
      dd.httpRequest({
        url: 'https://api.yonyouup.com/api/inventory/batch_get' + params,
        method: 'GET',
        success: res => {
          if(res.data.errcode == '0') {
            that.setData({
              stockSearchResult: res.data.inventory
            })
          }else{
            that.setData({
              noStock: true
            });
          };
        }
      });
    };
  },
  // 获取个人信息 -----// 使用钉钉的appKey和appSecret
  getResponInfo(){
    var that = this;
    var authCode = '';
    var accessToken;
    // 第一步   获取免登授权码
    dd.getAuthCode({
      success: res => {
        authCode = res.authCode;
      }
    });
    // 第二步    获取access_token
    dd.httpRequest({
      url: 'https://oapi.dingtalk.com/gettoken?appkey=' + getApp().globalData.appKey_dd + '&appsecret=' + getApp().globalData.appSecret_dd,
      method: 'GET',
      success: res => {
        accessToken = res.data.access_token;
        // 获取userid
        dd.httpRequest({
          url: 'https://oapi.dingtalk.com/user/getuserinfo?access_token=' + accessToken + '&code=' + authCode,
          method: 'GET',
          success: res => {
            // 将个人信息放入缓存
            dd.setStorage({
              key: 'userInfo',
              data: {
                userId: res.data.userid,
                is_sys: res.data.is_sys,
                sys_level: res.data.sys_level
              }
            });
          }
        });
      }
    });
  }
});

