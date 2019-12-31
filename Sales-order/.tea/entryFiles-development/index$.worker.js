if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


var AFAppX = self.AFAppX.getAppContext
  ? self.AFAppX.getAppContext().AFAppX
  : self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;
self.requirePlugin = AFAppX.requirePlugin;
        


function success() {
require('../../app');
require('../../node_modules/mini-antui/es/list/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/list/list-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/search-bar/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/common/components/block-list/block-list?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/add/add?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/index/index?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/order-detail/order-detail?hash=3e2e5e2d473d03821badb5452a72c12422f436f6');
require('../../pages/customer/customer?hash=3e2e5e2d473d03821badb5452a72c12422f436f6');
require('../../pages/search/search?hash=1d7df6d3015bd8351a76faa013b5a9f559b1a1bb');
require('../../pages/order-row-detail/order-row-detail?hash=3e2e5e2d473d03821badb5452a72c12422f436f6');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}