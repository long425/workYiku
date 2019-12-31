Page({
  data: {
    DATA: {},
    "parentvo": {
      "ccustomername": "",//客户名称--用于展示
      "cdeptname": "",//部门名称---用于页面展示
      "csalecorpname": "",  // 销售组织名称
      "ccalbodyname": "",// 库存组织名称

      "cbiztype": "so01",//业务流程--普通销售
      "ccustomerid": "",//客户id-----------必填项
      "cdeptid": "",//部门-----------------必填项
      "pk_corp": "001",//公司--------------必填项
      "csalecorpid": "0001",//销售组织-----必填项
      "ccalbodyid": "0001",//库存组织------必填项
      "coperatorid": "demo1",//制单人
      "dbilldate":"",//单据日期
      "vreceiveaddress": "",//收货地址
      "dconsigndate": "",//发货日期
      "ntaxrate": "16"//税率
    },
    //"childrenvo": [{
      //"dconsigndate": "", // 计划发货日期
      //"cinventoryid": "",//存货
      //"nnumber": "",//数量
      //"noriginalcurprice": "",//无税单价
      //"noriginalcurtaxprice": "",//含税单价
      //"noriginalcurmny": "",//无税金额
      //"noriginalcursummny": "",//价税合计
      //"ntaxrate": "16", //税率
   // }],
    "childrenvo": []
  },
  // 页面加载中
  onLoad(options) {
    var that = this;
    //dd.removeStorage({key:'DATA'})
    dd.getStorage({key: 'DATA',success: res => {
      if(res.data){
        var DATA = JSON.parse(res.data);
        var parentvo = that.data.parentvo;
        var childrenvo = that.data.childrenvo;
        parentvo = DATA.parentvo;
        parentvo.pk_corp = '001';//---无接口，写死
        parentvo.cbiztype = 'so01';
        parentvo.coperatorid = 'demo1';//---操作人，写死
        childrenvo = DATA.stock;
        that.setData({ DATA: DATA, parentvo: parentvo,childrenvo: childrenvo });
      };
    }});
  },
  getCustom(){ dd.navigateTo({ url: '/pages/list/customers/customers' }) },//跳转选择客户
  getBranch(){ dd.navigateTo({ url: '/pages/list/branch/branch' }) },//跳转选择部门
  getTeamBySale(){ dd.navigateTo({ url: '/pages/list/teamSale/teamSale' }) },//跳转选择销售组织
  getTeamByReserve(){ dd.navigateTo({ url: '/pages/list/teamStock/teamStock' }) },//跳转选择库存组织
  // 预发货日期
  chooseSendDate() {
    var that = this;
    var emptyDATA = { parentvo: {}, childrenvo: {} };
    var DATA = (Object.keys(that.data.DATA).length > 0) ? that.data.DATA : emptyDATA;
    dd.datePicker({ format: 'yyyy-MM-dd', startDate: '2019-01-01', endDate: '2119-01-01', success: res => {
      if(Object.keys(res).length > 0){
        var parentvo = that.data.parentvo;
        var childrenvo = that.data.childrenvo;
        parentvo.dconsigndate = res.date;
        DATA.parentvo.dconsigndate = res.date;
        if(DATA.stock && DATA.stock.length > 0) { DATA.stock.forEach(item => { item.dconsigndate = res.date; }) };
        if(childrenvo && childrenvo.length){ childrenvo.forEach(item => { item.dconsigndate = res.date; }) };
        that.setData({ DATA: DATA, parentvo: parentvo, childrenvo: childrenvo });
        dd.setStorage({ key: "DATA", data: JSON.stringify(DATA) });
      };
    }});
  },
  // 添加新的订单明细行
  addNew() { dd.navigateTo({ url: '/pages/list/stock/stock' }) },
  // 删除一个明细行
  deleteOrder(e) {
    var that = this;
    var emptyDATA = { parentvo: {}, childrenvo: {} };
    var DATA = (Object.keys(that.data.DATA).length > 0) ? that.data.DATA : emptyDATA;
    var thisClickIndex = e.currentTarget.id;      // 点击订单的索引
    var orderHeader = that.data.orderHeader;      // 订单表头
    var childrenvo = that.data.childrenvo;          // 订单明细存货列表
    // 提示弹窗
    dd.confirm({
      title: '温馨提示',
      content: '是否想要删除订单明细（' + (thisClickIndex+1) + '）',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      success: (result) => {
        if(result.confirm) {
          if(childrenvo && childrenvo.length){ childrenvo.splice(thisClickIndex,1); };
          if(DATA.stock && DATA.stock.length){ DATA.stock.splice(thisClickIndex,1); };
          that.setData({ DATA:DATA, childrenvo: childrenvo, orderHeader: orderHeader });// 更新订单数据    
          dd.setStorage({ key: 'DATA', data: JSON.stringify(DATA) });// 将改变后的订单存入本地
        };
      },
    });
  },
  // 修改销售订单表头
  changeHeaderValue(e) {
    var that = this;
    var emptyDATA = { parentvo: {}, childrenvo: {} };
    var DATA = (Object.keys(that.data.DATA).length > 0) ? that.data.DATA : emptyDATA;
    var parentvo = that.data.parentvo;
    var childrenvo = that.data.childrenvo;
    var dataName = e.currentTarget.dataset.name;
 
    parentvo[dataName] = e.detail.value;
    DATA.parentvo[dataName] = e.detail.value;
    if(DATA.stock && DATA.stock.length){ DATA.stock.forEach(item => { item[dataName] = e.detail.value }); };
    if(childrenvo && childrenvo.length){ childrenvo.forEach(item => { item[dataName] = e.detail.value }); };

    that.setData({ DATA:DATA, parentvo: parentvo, childrenvo: childrenvo });
    dd.setStorage({ key: "DATA", data: JSON.stringify(DATA) });
  },
  // 修改销售订单订单明细行
  changeStockValue(e) {
    var that = this;
    var emptyDATA = { parentvo: {}, childrenvo: {} };
    var DATA = (Object.keys(that.data.DATA).length > 0) ? that.data.DATA : emptyDATA;
    var taxrate = parseFloat(that.data.parentvo.ntaxrate);      // 税率
    var childrenvo = that.data.childrenvo;              // 订单存货明细
    var dataName = e.currentTarget.dataset.name;      // 修改的明细行内容
    var changeIndex = e.currentTarget.dataset.hi;     // 修改的明细行索引
    switch(dataName) {
      case 'nnumber':            // 数量
        DATA.stock[changeIndex].nnumber = e.detail.value;
        if(DATA.stock[changeIndex].nnumber != '' && DATA.stock[changeIndex].noriginalcurtaxprice != ''){
          DATA.stock[changeIndex].noriginalcurmny = Math.floor(parseFloat(DATA.stock[changeIndex].nnumber)*parseFloat(DATA.stock[changeIndex].noriginalcurprice)*100)/100;
          DATA.stock[changeIndex].noriginalcursummny = Math.floor(parseFloat(DATA.stock[changeIndex].nnumber)*parseFloat(DATA.stock[changeIndex].noriginalcurtaxprice)*100)/100;
        };
        break;
      case 'noriginalcurprice':           // 无税单价
        DATA.stock[changeIndex].noriginalcurprice =  e.detail.value;
        DATA.stock[changeIndex].noriginalcurtaxprice = (DATA.stock[changeIndex].noriginalcurprice) ? Math.floor(parseFloat(DATA.stock[changeIndex].noriginalcurprice)*(100 + taxrate))/100 : '';
        if(DATA.stock[changeIndex].noriginalcurprice != '' && DATA.stock[changeIndex].nnumber != ''){
          DATA.stock[changeIndex].noriginalcurmny = Math.floor(parseFloat(DATA.stock[changeIndex].nnumber)*parseFloat(DATA.stock[changeIndex].noriginalcurprice)*100)/100;
          DATA.stock[changeIndex].noriginalcursummny =  Math.floor(parseFloat(DATA.stock[changeIndex].nnumber)*parseFloat(DATA.stock[changeIndex].noriginalcurtaxprice)*100)/100;
        };
        break;
      case 'noriginalcurtaxprice':        // 含税单价
        DATA.stock[changeIndex].noriginalcurtaxprice =  e.detail.value;
        DATA.stock[changeIndex].noriginalcurprice = (DATA.stock[changeIndex].noriginalcurtaxprice) ? Math.floor(parseFloat(DATA.stock[changeIndex].noriginalcurtaxprice)/(100 + taxrate)*10000)/100 : '';
        if(DATA.stock[changeIndex].nnumber != '' && DATA.stock[changeIndex].noriginalcurtaxprice != ''){
          DATA.stock[changeIndex].noriginalcurmny = Math.floor(parseFloat(DATA.stock[changeIndex].nnumber)*parseFloat(DATA.stock[changeIndex].noriginalcurprice)*100)/100;
          DATA.stock[changeIndex].noriginalcursummny =  Math.floor(parseFloat(DATA.stock[changeIndex].nnumber)*parseFloat(DATA.stock[changeIndex].noriginalcurtaxprice)*100)/100;
        };
    };
    // 订单明细行中'数量'，'无税单价','含税单价'任何一个为空值，该明细行'无税金额'，'价税合计'为0或空
    if(DATA.stock[changeIndex].nnumber == '' || DATA.stock[changeIndex].noriginalcurprice == '' || DATA.stock[changeIndex].noriginalcurtaxprice == '') {
      DATA.stock[changeIndex].noriginalcurmny = '';
      DATA.stock[changeIndex].noriginalcursummny = '';
    };
    childrenvo = DATA.stock;
    that.setData({ DATA: DATA, childrenvo: childrenvo });
    dd.setStorage({ key: 'DATA', data: JSON.stringify(DATA) });
  },
  // 提交保存订单
  checkToInset() {
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var userCode = getApp().globalData.U8C.usercode;
    var passWord = getApp().globalData.U8C.password;
    var data = JSON.stringify({ "saleorder": [{ "childrenvo": that.data.childrenvo, "parentvo": that.data.parentvo }] });
    // 提交之前检查必填项
    console.log(that.data.parentvo.cdeptid)
    if(!that.data.parentvo.ccustomerid){ dd.showToast({ type:'fail', content:'请先选择销售客户',duration:'2000' }); return false };//客户
    if(!that.data.parentvo.cdeptid){ dd.showToast({ type:'fail', content:'请先选择销售部门',duration:'2000' }); return false };//部门
    if(!that.data.parentvo.csalecorpid){ dd.showToast({ type:'fail', content:'请先选择销售组织',duration:'2000' }); return false };//销售组织
    if(!that.data.parentvo.ccalbodyid){ dd.showToast({ type:'fail', content:'请先选择库存组织',duration:'2000' }); return false };//库存组织
    if(!that.data.childrenvo){ dd.showToast({ type:'fail', content:'请先选择销售存货',duration:'2000' }); return false }
    for(let i = 0; i < that.data.childrenvo.length; i++) {
      if(!that.data.childrenvo[i].nnumber){ dd.showToast({ type:'fail', content:'请输入订单明细['+(i+1)+']销售存货数量',duration:'2000' }); return false };
      if(!that.data.childrenvo[i].noriginalcurprice ){ dd.showToast({ type:'fail', content:'请输入订单明细['+(i+1)+']销售存货单价',duration:'2000' }); return false };
    };
    
    // 提交销售订单
    dd.httpRequest({
      headers: { "trantype": "code", "system": system, "usercode": userCode, "password": passWord,"needStackTrace": "Y" },
      url: "http://"+port+"/u8cloud/api/so/saleorder/insert",
      method: "POST",
      data: data,
      dataType: "json",
      success: res => {
        if(res.data && res.data.status === 'success'){
          var storageList = [{key: "customer"},{key: "branch"},{key: "sendDate"},{key: "headerData"},{key: "stockList"}]
          storageList.forEach(item => dd.removeStorage(item));
          dd.alert({ title: '保存成功', content: '保存新增订单成功！', buttonText: '查看订单列表', success: () => {
            dd.removeStorage({ key: "DATA", success: () => {dd.reLaunch({ url: '/pages/index/orderList/orderList' })} })
          }});
        };
      }
    });
  }
});