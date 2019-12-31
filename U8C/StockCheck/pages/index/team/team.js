Page({
  data: {
    teamList: [],
  },
  onLoad() {
    var that = this;
    that.getTeamList();
  },
  getTeamList(){
    var that = this;
    var port = getApp().globalData.U8C.port;
    var system = getApp().globalData.U8C.system;
    var usercode = getApp().globalData.U8C.usercode;
    var password = getApp().globalData.U8C.password;

    dd.httpRequest({
      headers: { "system": system, "usercode": usercode, "password": password },
      url: "http://"+port+"/u8cloud/api/uapbd/calbody/query",
      method: "POST",
      data: JSON.stringify({}),
      dataType: "json",
      success: res => {
        if(res.data.status === "success"){
          var stockTeamData = JSON.parse(res.data.data).datas;
          // console.log(stockTeamData)
          that.setData({ teamList: stockTeamData })
        };
      }
    })
  },
  checkToSort(e) {
    var teamCode = e.target.dataset.code;
    var teamName = e.target.dataset.name;
    var stockTeamList = this.data.teamList;
    stockTeamList.forEach(item => {
      if(item.bodycode == teamCode){
        var stockTeam = JSON.stringify(item); 
        dd.setStorage({ key:"stockTeam", data:stockTeam, success: res => dd.navigateTo({ url: '/pages/index/sort/sort' }) });
      };
    });
  }
});
