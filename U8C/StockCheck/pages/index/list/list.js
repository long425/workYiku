Page({
  data: {
    stockList: [
      {name: 'VIVO1', code: '0101'},
      {name: 'VIVO2', code: '0102'},
      {name: 'VIVO3', code: '0103'},
      {name: 'VIVO4', code: '0104'},
      {name: 'VIVO5', code: '0105'},
      {name: 'VIVO6', code: '0106'}
    ]
  },
  onLoad(query) {
    let sortCode = (query.code != '')? query.code : '';
  },
  getStockList(code) {

  },
  checkToSearchStock() {
    dd.navigateTo({
      url: '/pages/index/search/search'
    });
  },
  checkToStockDetail(code) {

  }
});
