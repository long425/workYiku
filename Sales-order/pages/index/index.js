// 当前日期 new Date().toLocaleDateString().replace(/(\/)/g,'-')
Page({
  data:{
    startDate: '',        // 销售订单开始日期
    endDate: '',          // 销售订单结束日期
    orderState: 'Openging',                                                          // 销售订单状态

    stateArray: [                                                           // 销售订单状态列表
      { id: 'Opening', name: '未审核'},
      { id: 'Approved', name: '已审核'},
      { id: 'Closed', name: '关闭'}
    ],
    arrIndex: '0',
    orderList: [],                                                           // 符合搜索条件的销售订单列表

    isRoll: true,                                                            // 是否滚动订单列表
    modelIsShow: false,                                                       // 是否显示弹出窗
    userId: '',
    verifyBtnIsShow: false
  },
  // 页面加载
  onLoad(query) {
    // console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    var that = this;
    that.setData({
      orderState: 'Opening',
    })
    // 获取订单列表
    that.getOrderList(that.data.startDate,that.data.endDate,'Opening');
    // 从缓存中取出个人信息（钉钉）
    dd.getStorage({
      key: 'userInfo',
      success: res => {
        that.setData({
          userId: res.data.userId
        });
        if(getApp().globalData.userIdArr.includes(res.data.userId)){
          that.setData({
            verifyBtnIsShow: true
          });
        };
      }
    });
    
  },
  // 显示时间选择器
  datePicker() {
    var that = this;
    dd.datePicker({
      currentDate: new Date().toLocaleDateString().replace(/(\/)/g,'-'),
      startDate: '2019-01-01',
      endDate: '2119-01-01',
      success: (res) => {
        if(res.date){
          that.setData({
            startDate: res.date
          });
        };
      },
      fail: result => {
        console.log('123456');
      }
    });
  },
  // 选择开始日期触发事件
  checkStartDate(e){
    var that = this;
    dd.datePicker({
      currentDate: new Date().toLocaleDateString().replace(/(\/)/g,'-'),
      startDate: '2019-01-01',
      endDate: '2119-01-01',
      success: (res) => {
        if(res.date){
          that.setData({
            startDate: res.date
          });
          // 获取销售订单列表
          that.getOrderList(that.data.startDate,that.data.endDate,that.data.orderState);
        };
      },
      fail: error => {
        console.log(error);
      }
    });
  },
  // 选择结束日期触发事件
  checkEndDate(e){
    var that = this;
    dd.datePicker({
      currentDate: new Date().toLocaleDateString().replace(/(\/)/g,'-'),
      startDate: '2019-01-01',
      endDate: '2119-01-01',
      success: (res) => {
        if(res.date){
          that.setData({
            endDate: res.date
          });
          // 获取销售订单列表
          that.getOrderList(that.data.startDate,that.data.endDate,that.data.orderState);
        };
      },
      fail: error => {
        console.log(error.errorMessage);
      }
    });
  },
  // 选择发货订单状态触发事件
  checkOrderState(e){
    var that = this;
    that.setData({
      orderState: that.data.stateArray[e.detail.value].id,
      arrIndex: e.detail.value,
    });
    // 获取销售订单列表
    that.getOrderList(that.data.startDate,that.data.endDate,that.data.orderState);
  },
  // 查看一张发货订单详情
  seeOrderInfo(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    dd.navigateTo({
      url: '/pages/order-detail/order-detail?orderId=' + orderId
    });
  },
  // 点击审核按钮，弹出审核对话框
  checkToVerify(e){
    var that = this;
    var appKey = getApp().globalData.appKey_U8;
    var token = getApp().globalData.token;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token;
    var orderId = e.currentTarget.dataset.orderId;
    var userId = getApp().globalData.userId;

    dd.confirm({
      title: '审核销售订单',
      content: '确定审核这张销售订单吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: res => {
        if(res.confirm){
          dd.httpRequest({
            headers: {
              "Content-Type": "application/json"
            },
            url: 'https://api.yonyouup.com/api/saleorder/verify' + params,
            data: JSON.stringify({
              'saleorder': {
                'voucher_code': orderId
              }
            }),
            method: 'POST',
            dataType: 'json',
            success: res => {
              console.log(res);
              if(res.data.errcode == '0'){
                dd.showToast({
                  type: 'success',
                  content: '审核成功',
                  duration: '1500'
                });
              };
            },
            fail: error => {
              console.log(err.data.errmsg);
            }
          })
        }
      },
      fail: error => {
        console.log(error);
      }
    })
  },
  // 弃审一张发货订单
  checkToUnverify(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    var appKey = getApp().globalData.appKey_U8;
    var token = getApp().globalData.token;
    var params = '?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + '&token=' + token;

    dd.confirm({
      title: '弃审销售订单',
      content: '确定要弃审这张销售订单吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: res => {
        if(res.confirm){
          dd.httpRequest({
            headers: {
              'Content-Type': 'application/json'
            },
            url: 'https://api.yonyouup.com/api/saleorder/unverify' + params,
            method: "POST",
            data: JSON.stringify({
              'saleorder' : {
                'voucher_code': orderId
              }
            }),
            dataType: 'json',
            success: res => {
              console.log(res);
            },
            fail: error => {
              console.log(error.data.errmsg);
            }
          })
        }
      },
      fail: error => {
        console.log(error.data.errmsg);
      }
    })
  },

  /*
  * 获取销售订单列表
  * startDate      销售订单开始日期
  * endDate        销售订单结束日期
  * orderStatus    销售订单审核状态
  */ 
  getOrderList(startDate,endDate,orderStatus){
    var that = this;
    var appKey = getApp().globalData.appKey_U8;
    var _token = getApp().globalData.token;
    var params = '&token=' + _token + '&date_begin=' + startDate + '&date_end=' + endDate + '&state=' + orderStatus;
    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/saleorderlist/batch_get?from_account=ZJYiKu&to_account=test_ZJYiKu&app_key=' + appKey + params,
      dataType: 'json',
      method: 'GET',
      success: res => {
        if(res.data.errcode == '0') {
          that.setData({
            orderList: res.data.saleorderlist
          })
        }
      },
      fail: err => {
        console.log(err);
      }
    })
  }
});
