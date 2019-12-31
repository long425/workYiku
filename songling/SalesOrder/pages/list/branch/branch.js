Page({
  data: {
    branchList: []
  },
  onLoad() {
    var that = this;
    dd.showLoading({ content: '请求部门列表中，请稍候...' });
    that.getCustomerList();
  },
  getCustomerList() {
    var that = this;
    var token = getApp().globalData.token;
    var U8Data = getApp().globalData.U8;
    var params = '?from_account=' + U8Data.from_account + '&to_account=' + U8Data.to_account + '&app_key=' + U8Data.appKey + '&token=' + token;

    dd.httpRequest({
      url: 'https://api.yonyouup.com/api/department/batch_get' + params,
      method: 'GET',
      success: res => {
        dd.hideLoading();
        if (res.data.errcode == '0') {
          that.setData({
            branchList: res.data.department
          });
        }
      }
    })
  },
  checkBranch(e) {
    let that = this;
    let deptname = e.target.dataset.name;
    let deptcode = e.target.dataset.code;
    let branch = JSON.stringify({ deptname: deptname, deptcode: deptcode });

    // 将客户名称和编码存入缓存
    dd.setStorage({
      key: 'branch',
      data: branch,
      success: res => {
        dd.reLaunch({
          url: '/pages/index/addNew/addNew'
        });
      },
      fail: error => {
        console.log(error)
      }
    })
  }
});