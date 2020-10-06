// pages/video/video.js
const app = getApp()
const { $Toast } = require('../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classLevel:0,
    classList:[],
    classListSubscript:0,
    canUp:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      classLevel: options.classLevel,
    });
   
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res.data)
        wx.request({
          url: app.globalData.baseURL + '/class/getVideoByUserAndLevel',
          data: {
            userId: res.data.userId,
            level: that.data.classLevel
          },
          success: function (result) {
            var temp = result.data
            var s = true
            for(let i =0;i<temp.length;i++){
              if(temp[i].state == 0){
                s = false
              }
            }
            that.setData({
              user:res.data,
              classList: result.data,
              canUp:s
            })
          }
        })
      },
    })
  },
  
  learn:function(e){
    let quert = e.currentTarget.dataset['index'];
    console.log(quert)
    wx.navigateTo({
      url:'./../showvideo/showvideo?videoUrl=' + quert,
    })
  },
  appraisals: function (e) {
    var that = this;
    let choiceIdList = e.currentTarget.dataset['index'];
    let id = e.currentTarget.dataset['id'];
    wx.navigateTo({
      url: './../appraisals/appraisals?choiceIdList=' + choiceIdList + "&id=" + id + "&classLevel="+that.data.classLevel,
    })
  },

  upLevel(){
    var that = this
    var canUp = this.data.canUp;
    var user = this.data.user;
    var classLevel =this.data.classLevel;
    if(user.userLevel != classLevel){
      var s = '您的等级已经超出此课程'
      that.handleText(s)
      return;
    }
     if(canUp){
        wx.request({
          url: app.globalData.baseURL + '/user/upUserLevel',
          data:{
            userId:user.userId
          },success:function(res){
            if(res.data){
              user.userLevel = user.userLevel+1
              //更新用户的等级
              wx.setStorage({
                key: 'userInfo',
                data: user,
              })
              that.handleText('恭喜您您的等级已经提升')
            }
          }
        })
     }else{
       var content = '请完保证所有都60以上才可进行等级提升'
        that.handleText(content)
     }
  },
  handleText(e) {
    $Toast({
      content:e
    });
  },

  
})