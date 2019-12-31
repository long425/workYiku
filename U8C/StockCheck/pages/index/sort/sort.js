Page({
  data: {
    sortList: [],
  },
  onLoad() {
    var that = this;
    that.getSortList();
  },
  getSortList(){
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
      url: "http://"+port+"/u8cloud/api/uapbd/bdinvcl/query",
      method: "POST",
      data: JSON.stringify({}),
      dataType: "json",
      success: res => {
        if(res.data.status === "success"){
          var stockSortData = JSON.parse(res.data.data).datas;
          console.log(stockSortData)
          that.setData({
            sortList: stockSortData
          })
        };
      }
    })
  },
  checkToSort(e) {
    dd.navigateTo({
      url: '/pages/index/search/search?code=' + e.target.dataset.code
    })
  }
});
