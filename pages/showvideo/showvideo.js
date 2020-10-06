// pages/showvideo/showvideo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      videoUrl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      videoUrl: options.videoUrl,
    });
  },
 
})