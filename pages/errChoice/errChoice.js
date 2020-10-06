// pages/errChoice/errChoice.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     user:{},
     errChoiceList:[],
     errChoiceSubScript:0,
     current: 1,

    isChoose:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
         that.setData({
           user:res.data
         })
         that.getErrChoiceList(that.data.user.userId)
      },
    })
  },

  getErrChoiceList:function(userId){
    var that = this;
    wx.request({
      url: app.globalData.baseURL +'/choice/getErrChoiceList',
      data:{
        userId:userId
      },
      success:function(res){
        console.log("ss"+res.data)
         that.setData({
           errChoiceList: res.data,
           isChoose: res.data[0].errCorrectMark
         })
      }
    })
  },
  handleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        current: this.data.current + 1,
        errChoiceSubScript: this.data.errChoiceSubScript+1
      });
    } else if (type === 'prev') {
      this.setData({
        current: this.data.current - 1,
        errChoiceSubScript: this.data.errChoiceSubScript - 1
      });
    }
  },
  select: function (e) {
    let quert = e.currentTarget.dataset['index'];
    this.setData({
      isChoose: quert
    })
  },

})