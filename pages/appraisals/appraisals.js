// pages/appraisals/appraisals.js
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
       userInfo:{},
       choiceIdList:[],
       userChoiceId:0,
    
      choiceList:[],
      choiceListSubscript:0,
      isChoose:0,
      errorChoiceList:[],
      ispopup:0,
      
      correctanswer:0   //正确答案数
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
            userInfo:res.data
          })
      },
    })
    
    this.setData({
      choiceIdList: options.choiceIdList,
      userChoiceId:options.id,
      classLevel: options.classLevel
    });
    wx.request({
      url: app.globalData.baseURL + '/choice/getVideoChoice',
      method:"POST",
      data:{
        choiceList: that.data.choiceIdList
      },
      success:function(res){
        that.setData({
          choiceList:res.data
        })
      }
    })
  },

   select: function (e) {
    let quert = e.currentTarget.dataset['index'];
    this.setData({
      isChoose: quert
    })
  },
  submit:function(e){
    let choiceList = this.data.choiceList
    let choiceListSubscript = this.data.choiceListSubscript
    let answer = choiceList[choiceListSubscript].correctMark
    let isChoose = this.data.isChoose
    let correctanswer = this.data.correctanswer
    let errorChoiceList = this.data.errorChoiceList

    if(answer == isChoose){
      this.setData({
        correctanswer: correctanswer + 1
      })
    }else{
      var m ={
        choiceId:choiceList[choiceListSubscript].id,
        nextErrAnswer: isChoose
      }
      errorChoiceList.push(m)
      this.setData({
        errorChoiceList: errorChoiceList
      })
    }
    this.setData({
      choiceListSubscript: choiceListSubscript+1,
      isChoose:0
    })
    if (choiceList.length - 1 == choiceListSubscript){
      this.setData({
        ispopup:1
      })
    }
  },
  commit(){
    var that = this;
    let choiceList = this.data.choiceList;
    let correctanswer = this.data.correctanswer;
    let cent = (correctanswer/choiceList.length)*100;
    let errorChoiceList = this.data.errorChoiceList;
    let userChoiceId = this.data.userChoiceId;
    let userInfo = this.data.userInfo; 
    wx.request({
      url: app.globalData.baseURL +'/class/checkClassChoice',
      method:"POST",
      data:{
        userChoiceId: userChoiceId,
        correctanswer: cent,
        errorChoiceList: errorChoiceList,
        userId: userInfo.userId
      },
      success:function(res){
        that.setData({
          ispopup:2
        })
      }
    })
  },   
  goBack(){
    wx.navigateBack();
  }
})