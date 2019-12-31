Page({
  data: {
    cdeptNum: '',
    judge: {
      isRoll: true,             // 是否滚动订单列表
      verifyBtnIsShow: true     // 是否显示审核按钮
    },
    stateIndex: '0',
    stateList: [
      {id: 'Opening', name: '未审核'},
      {id: 'Approved', name: '已审核'},
      {id: 'Closed', name: '关闭'}
    ],
    date: {
      start: '',
      end: ''
    },
    orderList: []
  },
  onLoad() {
    dd.showLoading({ content: '查询销售订单列表，请稍候...' });
    var that = this;
    // 获取员工工号
    dd.getStorage({ 
      key: 'jobNumber', 
      success: res => {
        if(res.data && res.data != ''){
          var jobNumber = res.data;
          var token = getApp().globalData.token;
          var U8Data = getApp().globalData.U8;
          var params = '?from_account=' + U8Data.from_account+'&to_account='+U8Data.to_account+'&app_key='+U8Data.appKey+'&token='+token+"&id="+jobNumber;
          
          dd.httpRequest({
            url: 'https://api.yonyouup.com/api/person/get' + params,
            method: 'GET',
            success: res => {
              if(res.data.errcode == '0') {
                var cdeptNum = res.data.person.cdept_num;
                that.setData({ cdeptNum: cdeptNum });
                that.getOrderList(that.data.date.start,that.data.date.end,'Opening',cdeptNum);
              };
            }
          });
        };
      } 
    });
  },
  // 订单状态改变
  changeOrderState(e) {
    var that = this;
    that.setData({
      stateIndex: e.detail.value
    });
    var startDate = that.data.date.start;
    var endDate = that.data.date.end;
    var orderState = that.data.stateList[e.detail.value].id;
    var cdeptNum = that.data.cdeptNum;
    that.getOrderList(startDate,endDate,orderState,cdeptNum);
  },
  // 订单开始日期改变
  changeOrderStartDate(e) {
    var that = this;
    // 打开日期选择器
    dd.datePicker({
      format: 'yyyy-MM-dd',
      startDate: '2019-01-01',
      endDate: '2119-01-01',
      success: res => {
        if(Object.keys(res).length > 0){
          var date = that.data.date;
          date.start = res.date;
          that.setData({ date: date });
          var startDate = that.data.date.start;
          var endDate = (that.data.date.end) ? that.data.date.end : '';
          var orderState = that.data.stateList[that.data.stateIndex].id;
          var cdeptNum = that.data.cdeptNum;
          that.getOrderList(startDate,endDate,orderState,cdeptNum);
        }
      },
      fail: error => {
        console.log(error);
      }
    });
  },
  // 订单结束日期改变
  changeOrderEndDate(e) {
    var that = this;
    // 打开结束日期选择器
    dd.datePicker({
      format: 'yyyy-MM-dd',
      startDate: '2019-01-01',
      endDate: '2119-01-01',
      success: res => {
        if(Object.keys(res).length > 0) {
          var date = that.data.date;
          date.end = res.date;
          that.setData({ date: date });
          var startDate = (that.data.date.start) ? that.data.date.start : '';
          var endDate = that.data.date.end;
          var orderState = that.data.stateList[that.data.stateIndex].id;
          var cdeptNum = that.data.cdeptNum;
          that.getOrderList(startDate,endDate,orderState,cdeptNum);
        };
      },
      fail: error => {
        console.log(error)
      }
    });
  },
  // 审核一张销售订单
  checkToVerify(e){
    let that = this;
    let token = getApp().globalData.token;
    let appKey = getApp().globalData.U8C.appKey;
    let orderId = e.currentTarget.dataset.orderId;

    // 弹出提示询问框
    dd.confirm({
      title: '提示',
      content: '您想要审核该订单吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: res => {
        if(res.confirm){
          console.log("1233");
          // 发送审核订单请求
        };
      }
    });
  },
  // 查看销售订单详情
  checkToSeeOrderDetail(e) {
    let that = this;
    let orderId = e.currentTarget.dataset.orderId;
    // 跳转到订单详情页
    dd.navigateTo({
      url: '/pages/detail/order/order?orderId=' + orderId
    });
  },
  // 获取销售订单列表
  /* *
   * * start(params)    订单查询开始日期
   * * end(params)      订单查询结束日期
   * * state(params)    订单查询状态
   * * cdept(params)    订单查询部门
   */
  getOrderList(start,end,state,cdept) {
    var that = this;
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var params = '?from_account='+U8Data.from_account+'&to_account='+U8Data.to_account+'&app_key='+U8Data.appKey+'&token='+token+'&date_begin='+start+'&date_end='+end+'&state='+state+'&deptcode='+cdept;
    // 请求销售订单列表
    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/saleorderlist/batch_get' + params,
      method: 'GET',
      success: res => {
        if(res.data.errcode == '0'){
          dd.hideLoading();
          that.setData({ orderList: res.data.saleorderlist });
        }
      }
    });
  },
});
