App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  globalData: {
    corp: '001',
    port: '39.104.91.237:8283',
    approvid: '14444444005',//审批人ID
    system: 'test',
    usercode: 'demo1',
    password: '827ccb0eea8a706c4c34a16891f84e7b'
  }
});
