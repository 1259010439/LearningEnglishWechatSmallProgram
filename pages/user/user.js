// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
       userName:'未知',
    },
    showView: true,
    isRuleTrue: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      that.login();
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.login();
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log("view",that.data.showView)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.login();
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    console.log(e.detail.userInfo)
    this.login();
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

  },
  login: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var userInfo = app.globalData.userInfo
        console.log(app.globalData.userInfo)
        console.log('url', app.globalData.baseURL + '/user/login')
        //发送请求
        wx.request({
          url: app.globalData.baseURL + '/user/login', //接口地址
          data: {
            code: res.code,
            userSex: userInfo.gender,
            userName: userInfo.nickName,
            userCity: userInfo.city,
            userProvince: userInfo.province
          },
          header: {
            'content-type': 'application/json' //默认值
          },
          success: function (res) {
            app.globalData.user = res.data;
            var user = res.data;
            //判断showView是否显示
            if(user.userLevel <= 0){
              that.setData({ showView:false})
            }else{
              that.setData({ showView:true})
            }
            //判断tabBar是否显示
            if (!that.data.showView){
              wx.hideTabBar();
            }else{
              wx.showTabBar();
            }
            if (user.userSex == '1') { that.setData({userSex:'♂'}) }
            else if (user.userSex == '0') { that.setData({ userSex: '♀' })  }
            else { that.setData({ userSex: '未知' })  }
            console.log("登录后的user"+JSON.stringify(user))
            that.setData({
              user:user
            })
            wx.setStorage({
              key: 'userInfo',
              data:user
            })
            
          }
        })
      }
    })
  },
  tongji:function(){
    if(app.globalData.user!=null){
      wx.navigateTo({
        url: '/pages/tongji/tongji?id=' + app.globalData.user.userId,
      })
    }
    else{
      wx.showToast({
        title: '请先注册/登录',
        image: '/images/alert-circle.svg',
        duration: 1000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  about:function(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  fankui:function(){
    this.setData({
      isRuleTrue:true
    })
  },
  hideRule:function(){
    this.setData({
      isRuleTrue: false
    })
  },
  kefu:function(){
    this.hideRule();
  },
  setting:function(){
    if (app.globalData.user != null) {
      wx.navigateTo({
        url: '/pages/setting/setting',
      })
    }
    else {
      wx.showToast({
        title: '请先注册/登录',
        image: '/images/alert-circle.svg',
        duration: 1000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  torating:function(){
    console.log('tiaozhuan')
    wx.navigateTo({
      url:'../rating/rating'
    })
  },
  errChoice:function(){
    wx.navigateTo({
      url: '../errChoice/errChoice',
    })
  }

})