App({
  onLaunch(options) {
    // 第一次打开
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
  },
  // 全局变量
  globalData: {
    token: '',                  // 全局唯一识别码
    tradeid: '',                // 全局唯一交易码
    taxrate: 16,
    accessToken: '',            // access_token
    U8: {
      from_account: 'ZJYiKu',
      to_account: 'test_ZJYiKu',
      appKey: 'opa7f4a2a2667040195',
      appSecret: 'e837bd3121ba4ebaa61b6614a091e3f9'
    },
    DD: {
      appKey: 'dingo8gfl82bygoplx64',
      appSecret: 'rfCTAoquldCnRnTaSAzulsKtHILM-IYJQk3sAOSMftaiinCT9amm21zpxN2li3mR'
    },
    ddUserIdList: [],         // 具有审批权限的钉钉用户ID列表
    ddUserInfo: {
      userId: '',             // 钉钉登录用户ID
      is_sys: false,          // 钉钉登录用户是否管理员
      sys_level: '0',         // 钉钉登录用户管理级别 1：主管理员，2：子管理员，100：老板，0：其他（如普通员工）
    }
  }
});
