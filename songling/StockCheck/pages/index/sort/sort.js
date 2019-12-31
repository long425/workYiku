Page({
  data: {
    sortList: [
      {name: '产成品', code: '01'},
      {name: '半成品', code: '02'},
      {name: '原材料', code: '03'}
    ],
  },
  onLoad() {},
  getToken() {

  },
  getSortList(){

  },
  checkToSort(e) {
    dd.navigateTo({
      url: '/pages/index/list/list?code=' + e.target.dataset.code
    })
  }
});
