// pages/vocabulary/vocabulary.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowLearnWordNumber:0,
    nowLearnWordStateOne: 0,
    knowWordNumber: 0,
    nowLearnWordStateZero: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      
  },
  
  onShow: function (options){
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(that.data.user)
         that.getUserWordInfo(res.data.userId)
      },
    })
  },
  nextGroup(){
    var that = this; 
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        wx.request({
          url: app.globalData.baseURL + '/word/getNextGroupWordList',
          data: {
            userId:res.data.userId
           },
          success: function (result) {
            if (result.data){
               that.getUserWordInfo(res.data.userId)
             }else{
               wx.showToast({
                 title: '拉取单词失败请重试',
                 image: '/images/alert-circle.svg',
                 duration: 1000,
                 mask: true,
                 success: function (res) { },
                 fail: function (res) { },
                 complete: function (res) { },
               })

             }
          }
        })
      },
    })
  },
  getUserWordInfo(userId){
    var that = this;
    wx.request({
      url: app.globalData.baseURL + '/word/getUserMemoryWordInfo',
      data: {
        userId:userId
      },
      success: function (res) {
        that.setData({
          nowLearnWordNumber: res.data.nowLearnWordNumber,
          nowLearnWordStateOne: res.data.nowLearnWordStateOne,
          knowWordNumber: res.data.knowWordNumber,
          nowLearnWordStateZero: res.data.nowLearnWordStateZero
        })
      }
    })
  },
  searchWord(){
    wx.navigateTo({
      url: "../word/word",
    })
  },
  wordrecitation(){
    wx.navigateTo({
      url: "../wordrecitation/wordrecitation",
    })
  }
})