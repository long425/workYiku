App({
  onLaunch(options) {
    // 第一次打开
  },
  onShow(options) {

  },
  globalData: {
    token: '',                  // 全局访问唯一识别码
    tradeid: '',                // 唯一交易号
    U8: {
      appKey: 'opa7f4a2a2667040195',                                                   // 应用编码（义库U8）
      appSecret: 'e837bd3121ba4ebaa61b6614a091e3f9',                                 // 密匙（义库U8）
    },
    dd: {
      appKey_dd: 'dingeo9i3vrtdyitviec',                                                   // 应用编码（义库钉钉）
      appSecret_dd: '3y2qk6tWOmUd05cYoeT__sOU4WflF-epNFw66EP1DLOUXcPYOb08yhlIwlsCyA2R',    // 密匙（义库钉钉）
    }    
  }
});
