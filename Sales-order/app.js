App({
  // 小程序第一次打开
  onLaunch(options) {

  },
  onShow(options) {},
  globalData:{
    appKey_U8: 'opa7f4a2a2667040195',                                                   // 应用编码（义库U8）
    appSecret_U8: 'e837bd3121ba4ebaa61b6614a091e3f9',                                 // 密匙（义库U8）


    appKey_dd: 'dingeo9i3vrtdyitviec',                                                   // 应用编码（义库钉钉）
    appSecret_dd: '3y2qk6tWOmUd05cYoeT__sOU4WflF-epNFw66EP1DLOUXcPYOb08yhlIwlsCyA2R',    // 密匙（义库钉钉）
    //appKey: 'ding5wrgxha0rzd52coi',                                                   // 应用编码（祥龙）
    //appSecret: 'CIlBnmFxuDIHuRRfv5iBmEP-KUTmMZN6umhXy8eJEKqcnhT1RxO2fopPs9v-YO5F',    // 密匙（祥龙）
    authCode: '',             // 免登授权码
    accessToken: '',          // access_token
    token: '',                // 唯一全局识别码
    tradeid: '',              // 唯一全局交易号
    userIdArr: ['266755525030760235'],         // U8用户ID 
    userInfo: {
      userId: '',                     // 钉钉用户ID
      is_sys: false,                  // 钉钉是否是管理员
      sys_level: '0'                  // 钉钉级别 1：主管理员，2：子管理员，100：老板，0：其他（如普通员工）
    }
  }
});
