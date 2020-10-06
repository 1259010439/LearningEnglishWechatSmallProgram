// pages/rating/rating.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    testWord:[],
    wordSubScript:0,
    wordCorrectNumber:0,
    wordListSize:10,

    testSingleChoiceList:[],
    singleChoiceSubScript:0,  //数组下标
    singleChoiceCorrectNumber:0, //答对的题数
    singleChoiceListSize:33,
    isChoose:0,   //选择的答案 

    nowType:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //走两个接口
    var userInfo = app.globalData.userInfo
    this.getWordList();
    this.getSingleChoiceList();
    
  },

  know:function(e){
    let quert = e.currentTarget.dataset['index'];
    var that = this
    if(that.data.wordSubScript<that.data.wordListSize){
      //下标++
      that.setData({
        wordSubScript:that.data.wordSubScript + 1
      })
      //单词识别数++  1是认识 2是不认识
      if(quert == 1){
        that.setData({
          wordCorrectNumber:that.data.wordCorrectNumber + 1
        })
      }

      if(that.data.wordSubScript == that.data.wordListSize-1 ){
        that.setData({
          nowType:2
        })
      }
    }
  },

  getWordList:function(){
        var that = this
        //获取单词
        wx.request({
          url: app.globalData.baseURL + '/word/getTestWordList', //接口地址
          data: {
            wordListSize:that.data.wordListSize
          },
          header: {
            'content-type': 'application/json' //默认值
          },
          success: function (res) {
            that.setData({
              testWord: res.data
            }) 
            console.log("testword",that.data.testWord)
          }
        })
  },

  getSingleChoiceList:function(){
    var that = this
    //获取选择题
    wx.request({
      url: app.globalData.baseURL + '/choice/getSingleChoiceList',
      data: {
        singleChoiceListSize:that.data.singleChoiceListSize
      },
      method: 'GET', 
       header: {
        'content-type': 'application/json'
       }, // 设置请求的 header
      success: function(res){
        var jsonData = JSON.stringify(res.data);// 转成JSON格式
        var result = JSON.parse(jsonData);
        console.log("test1.0"+result)
        that.setData({
          testSingleChoiceList:result
        })
        console.log("test1"+that.data.testSingleChoiceList)
      }
    })
  },

  select:function(e){
    let quert = e.currentTarget.dataset['index'];
    this.setData({
      isChoose:quert
    })
  },
  submit:function(e){
    var subScript = this.data.singleChoiceSubScript;
    var jsonData = JSON.stringify(this.data.testSingleChoiceList[subScript]);// 转成JSON格式
    var result = JSON.parse(jsonData);
    let answer = result.correctMark;
    let grade = result.grade;
    let correctNumber = this.data.singleChoiceCorrectNumber;
  
    if(this.data.isChoose == answer){
      correctNumber = correctNumber+grade;
    }
    if(subScript<this.data.singleChoiceListSize-1){
      subScript++;
      this.setData({
        singleChoiceSubScript:subScript,
        singleChoiceCorrectNumber:correctNumber,
        isChoose:0
      })
    }else{
      this.setData({
        nowType:3
      })
    }
  },
  submitAnswers:function(){
    var that =this
    wx.request({
      url: app.globalData.baseURL + '/choice/checkLevel',
      data: {
        userId:app.globalData.user.userId,
        wordListSize:that.data.wordListSize,
        wordCorrectNumber:that.data.wordCorrectNumber,
        singleChoiceListSize:that.data.singleChoiceListSize,
        singleChoiceCorrectNumber:that.data.singleChoiceCorrectNumber
      },
      method: 'POST',
      success: function(res){
        app.globalData.user.level = res.data.level;
        wx.reLaunch({
          url:'./../user/user',
          success:function(e){
             var curPages =  getCurrentPages().pop()
             console.log(curPages)
             if(curPages == undefined ||curPages==null ){return;}
             curPages.onLoad();
          }
        })
        
      },
    })

    
  },

 
 

  
})