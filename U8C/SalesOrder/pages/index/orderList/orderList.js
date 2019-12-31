Page({
  data: {
    judge: {
      isRoll: true,             // 是否滚动订单列表
      verifyBtnIsShow: true     // 是否显示审核按钮
    },
    stateList: [{id: '0', name: '未审核'},{id: '1', name: '已审核'}],
    orderState: '',
    date: {start: '', end: '' },
    orderList: []
  },
  onLoad() {
    this.getOrderList();
  },
  // 获取销售订单列表
  getOrderList() {
    var that = this;
    var corp = getApp().globalData.U8C.corp;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var userCode = getApp().globalData.U8C.usercode;
    var passWord = getApp().globalData.U8C.password;

    var beginDate = (that.data.date.start) ? that.data.date.start : new Date().toLocaleDateString().replace(/(\/)/g,'-');
    var endDate = (that.data.date.end) ? that.data.date.end : new Date().toLocaleDateString().replace(/(\/)/g,'-');
    var orderState = (that.data.orderState === '') ? '' : that.data.orderState + 1;

    // 请求销售订单列表
    dd.httpRequest({
      headers: { "Content-Type": "application/json", "system": system, "usercode": userCode, "password": passWord },
      url: 'http://'+port+'/u8cloud/api/so/saleorder/query',
      method: 'POST',
      data: JSON.stringify({ "corp": "001", "date_begin": beginDate, "date_end": endDate, "status": orderState }),
      dataType: 'json',
      success: res => {
        if(res.data && res.data.status == 'success') {
          var orderListData = JSON.parse(res.data.data);
          var orderList = orderListData.datas;
          if(orderList && orderList.length > 0){
            for(let i = 0;i < orderList.length; i++){
              let allMoney = 0;
              for(let j = 0; j < orderList[i].childrenvo.length;j++){
                allMoney += orderList[i].childrenvo[j].noriginalcursummny;
              };
              orderList[i].parentvo.nheadsummny = allMoney;
            };
          };
          that.setData({orderList: orderList});
        };
      }
    });

  },
  // 订单状态改变
  changeOrderState(e) {
    var that = this;
    that.setData({ orderState: e.detail.value});
    that.getOrderList();
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
        var date = that.data.date;
        date.start = res.date;
        that.setData({date: date});
        that.getOrderList();
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
        let date = that.data.date;
        date.end = res.date;
        that.setData({date: date});
        that.getOrderList();
      }
    });
  },
  // 审核一张销售订单
  checkToVerify(event){
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var userCode = getApp().globalData.U8C.usercode;
    var passWord = getApp().globalData.U8C.password;
    var approvid = getApp().globalData.U8C.approvid;
    var approveDate = new Date().toLocaleDateString().replace(/(\/)/g,'-');
    var dateBegin = (that.data.date.date_begin) ? that.data.date.date_begin : approveDate;
    var dateEnd = (that.data.date.date_end) ? that.data.date.date_end : approveDate;
    var saleId = event.currentTarget.dataset.saleId;
    dd.showActionSheet({
      title: '销售订单审批',
      items: ['通过', '不通过', '驳回'],
      cancelButtonText: '取消审批',
      success: (res) => {
        switch(res.index){
          case -1: var btnName = ''; break;
          case 0: var btnName = 'Y'; break;
          case 1: var btnName = 'N'; break;
          case 2: var btnName = 'R'; break;
        };

        if(btnName) {
          dd.httpRequest({
            headers: { "trantype": "code", "system": system, "usercode": userCode, "password": passWord },
            url: "http://"+port+"/u8cloud/api/so/saleorder/approve",
            method: 'POST',
            data: JSON.stringify({
              "approveinfo": { "approveDate": approveDate, "approvid": "demo1", "status": btnName },
              "queryinfo": { "date_begin": dateBegin, "date_end": dateEnd, "code": [saleId], "corp": "001" }
            }),
            dataType: 'json',
            success: res => {
              if(res.data = res.data.status === 'success'){
                dd.alert({ title:"审批成功", content:"销售订单审批成功", buttonText:"确定", success: () => {
                  that.getOrderList();
                }});
              };
            }
          });
        };
      },
    });
  },
  // 查看销售订单详情
  checkDetail(event){
    var that = this;
    var saleId = event.currentTarget.dataset.saleId;
    var checkData = that.data.orderList[event.currentTarget.dataset.site];
    dd.navigateTo({ url: '/pages/detail/order/order?orderData=' + JSON.stringify(checkData) })
  }
});