Page({
  data: {
    team: { code: '', name: '' },
    stockExtantNum: {},
    stockUsableNum: {},
    stockCode: '',
    stockDetail: {}
  },
  onLoad(query) {
    var that = this;
    if(Object.keys(query).length > 0) { var stockCode = query.stockCode; that.setData({ stockCode: stockCode })};

    dd.getStorage({
      key: "stockTeam",
      success: res => {
        if(Object.keys(res).length > 0) {
          var stockTeamData = JSON.parse(res.data);
          var team = that.data.team;
          that.setData({ team: stockTeamData });
          that.queryStockUsable(stockCode,stockTeamData)
        }
      }
    });

    that.queryStockDetail(stockCode);
    that.queryStockExtant(stockCode);
  },
  queryStockDetail(stockCode){
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var usercode = getApp().globalData.U8C.usercode;
    var password = getApp().globalData.U8C.password;

    dd.httpRequest({
      headers: {
        "system": system,
        "usercode": usercode,
        "password": password
      },
      url: "http://"+port+"/u8cloud/api/uapbd/invbasdoc/query",
      method: "POST",
      data: JSON.stringify({
        "invcode": stockCode
      }),
      dataType: "json",
      success: res => {
        if(res.data.status === 'success'){
          var stockDetailData = JSON.parse(res.data.data).datas[0].parentvo;
          that.setData({ stockDetail: stockDetailData });
        };
      }
    });
  },
  // 现存量查询
  queryStockExtant(stockCode){
    var that = this;

    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var usercode = getApp().globalData.U8C.usercode;
    var password = getApp().globalData.U8C.password;
    var stockExtantNum = that.data.stockExtantNum;
    dd.getStorage({ key: "stockTeam", success: res => {
        if(Object.keys(res).length > 0) {
          var stockTeamData = JSON.parse(res.data);
          var corp = stockTeamData.corpcode;
          var calbody = stockTeamData.bodycode;

          dd.httpRequest({
            headers: { "system": system, "usercode": usercode, "password": password },
            url: "http://"+port+"/u8cloud/api/ic/onhand/query",
            method: "POST",
            data: JSON.stringify({ "corp": corp, "calbody": calbody, "inventory": stockCode }),
            dataType: "json",
            success: res => {
              console.log(res);
              console.log(JSON.parse(res.data.data).datas)
              var data = JSON.parse(res.data.data).datas;
              that.setData({ stockExtantNum: data })
            }
          })
        };
      }
    });
  },
  // 可用量查询
  queryStockUsable(stockCode,teamData){
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var usercode = getApp().globalData.U8C.usercode;
    var password = getApp().globalData.U8C.password;

    dd.httpRequest({
      headers: { "trantype": "code", "system": system, "usercode": usercode, "password": password },
      url: "http://"+port+"/u8cloud/api/ic/atp/query",
      method: "POST",
      data: JSON.stringify({ "atp": [{"m_ccalbodyid": teamData.bodycode,"m_pk_corp": teamData.corpcode,"m_cinventoryid": stockCode}] }),
      dataType: "json",
      success: res => {
        if(res.data.status === 'success'){
          var data = JSON.parse(res.data.data);
          console.log(data)
          that.setData({stockUsableNum: data});
        };
      }
    })
  }
});
