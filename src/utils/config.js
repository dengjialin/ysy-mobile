export  default {
  name: '极速花贷款平台管理后台',
  prefix: 'antdAdmin',
  footerText: 'jisuhua  © 2017 ysy',
  logo: './logo.png',
  iconFontCSS: './iconfont.css',
  iconFontJS: './iconfont.js',
  baseURL: '/collection/', //请求路径基地址
  // YQL: ['http://www.zuimeitianqi.com'],
  // CORS: ['http://localhost:7000'],
  openPages: ['/login'], //全屏的路由页面
  //apiPrefix: '/api/v1',
  api: { //接口
    userLogin: '/rest/public/login/ajax', //登录
    userLogout: '/rest/public/login/logout', //登出
    dueLoans:'/rest/order/list', //全部逾期订单
    myLoans:'/rest/order/myList', //我的逾期订单任务
    saveCall:'/rest/serviceLog/save', //保存通话记录
    callHistory:'/rest/serviceLog/list', //获取通话记录
    loanRelatives:'/rest/order/relatives', //订单填写的联系人信息
    loanCallMost:'/rest/order/callInOut', //订单联系人的最频繁联系人
    loanAssign:'/rest/order/assignInfo', //订单分配信息
    remarkTags:'/rest/tags/list', //通话标签
    addTag:'/rest/tags/save', //添加新标签
    users:'/rest/user/list', //用户列表
    assign:'/rest/user/assign', //订单分配
    reAssign:'/rest/user/reassign', //重新分配订单
    createUser:'/rest/user/save', //新增用户
  },
}
