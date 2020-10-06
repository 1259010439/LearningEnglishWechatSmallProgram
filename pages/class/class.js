// pages/class/class.js
const app = getApp()
const { $Toast } = require('../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},

    progressone: 0,
    progresstwo: 0,
    progressthree: 0,
    progressfour: 0,
    progressfive: 0,
    progresssix: 0,  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      var that = this
       wx.getStorage({
         key: 'userInfo',
         success: function(res) {
           wx.request({
             url: app.globalData.baseURL +'/class/getUserCoursesInfo',
             data:{
               userId:res.data.userId,
               userLevel:res.data.userLevel
             },
             success:function(res){
               for (let key in res.data) {
                  that.initprogress(key, res.data[key])
               }
             }
           })
           that.setData({
             user:res.data
           })
         },
       })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  initprogress(key,list){
    var fz = 0;
    for(let i =0;i<list.length;i++){
      if (list[i].state == 1){
        fz++;
      }
    }
    var progressvalue = (fz/list.length)*100;
    if(key == 1){
      this.setData({
        progressone: progressvalue
      })
    }
    if (key == 2) {
      this.setData({
        progresstwo: progressvalue
      })
    }
    if (key == 3) {
      this.setData({
        progressthree: progressvalue
      })
    }
    if (key == 4) {
      this.setData({
        progressfour: progressvalue
      })
    }
    if (key == 5) {
      this.setData({
        progressfive: progressvalue
      })
    }
    if (key == 6) {
      this.setData({
        progresssix: progressvalue
      })
    }
  
  },
  toVideo:function(e){
    let quert = e.currentTarget.dataset['index'];
    if (this.data.user.userLevel < quert){
      this.handleText()
    }else{
      wx.navigateTo({
        url: './../video/video?classLevel=' + quert,
      })
    }
   
  },
  handleText() {
    $Toast({
      content: '请完成当前等级课程并完成等级考试才可解锁新课程'
    });
  },
})