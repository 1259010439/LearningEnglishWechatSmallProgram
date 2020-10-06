// pages/wordrecitation/wordrecitation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    wordList:[],

    showState:2,  //如果是0证明在循环listZero 1是listOne 2代表已经背完了
    zeroSzie:0,
    zeroNowSize:0,
    wordListZero:[],
    oneSzie:0,
    oneNowSize:0,
    wordListOne:[],
    //word相关
    ishive:true,
    test: [],
    word: '',
    wordstate:0,
    phon: '/\'sʌnɡləʊ/',
    webdetail:[],
    web:'',
    speakurl:'',
    canOnUnload:true
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      that.getwordList();
      
  },
  /**
 * 生命周期函数--监听页面卸载
 */
  onUnload: function () {
    var canOnUnload = this.data.canOnUnload
    if(canOnUnload){
      console.log("页面卸载")
      this.submitResult();
    }  
  },
  getwordList(){
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res){
        that.setData({
          user:res.data
        })
        wx.request({
          url: app.globalData.baseURL + '/word/getWordList', //接口地址
          data: {
            userId: that.data.user.userId
          },
          header: {
            'content-type': 'application/json' //默认值
          },
          success: function (res) {
           that.setData({
             wordList:res.data
           })
           var listZero=[];
           var listOne=[];
           var listTwo=[];
           var wordList = that.data.wordList
            for(var i=0;i<wordList.length;i++){
              let temp = wordList[i]
              console.log(temp)
              if(temp.state == 0){
                listZero.push(i)
              }
              if(temp.state == 1){
                listOne.push(i)
              }
            }
           if(listZero.length>0){
             that.setData({
               showState:0
             })
           }else if(listOne.length>0){
            that.setData({
              showState:1
            })
           }else{
             that.setData({
               showState:2
             })
           }
           that.setData({
             zeroSzie:listZero.length,
             wordListZero:listZero,
             oneSzie:listOne.length,
             wordListOne:listOne
           })
           console.log()
            //word初始化
           if(that.data.showState == 0){
             that.setData({
               word:wordList[listZero[0]].word,
               wordstate:0
             })
           }else if(that.data.showState == 1){
             that.setData({
               word: wordList[listOne[0]].word,
               wordstate:1
             })
           }
           //给word属性进行赋值
           that.searchWord();
          }
        })
      },
    })
  },
  searchWord: function () {
    this.getdata(this.data.word)
  },
  getdata: function (a) {
    var self = this;
    console.log(a);
    if (app.globalData.user != null) {
      wx.request({
        url: app.globalData.baseURL + '/word/getByWord',
        data: {
          word: a,
          userId: app.globalData.user.userId
        },
        header: ({
          "context-type": "text/xml"
        }),
        method: "GET",
        dataType: 'json',
        success: function (res) {
          //console.log('getdata.() success');
          console.log(res.data);
          if (res.data.basic != null) {
            var transl = res.data.basic.explains;
            console.log(transl)
            self.setData({
              word: a,
              test: transl,

            })
            if (res.data.basic.phonetic != null) {
              self.setData({
                phon: '音标: /' + res.data.basic.phonetic.replace(";", "/,/") + '/'
              })
            }
            else {
              self.setData({
                phon: '无音标'
              })

            }
            if (res.data.web != null) {
              var webinfo = res.data.web;
              console.log(webinfo);
              self.setData({
                web: '以下内容来自网络',
                webdetail: webinfo
              })
            }
          }
          else if (res.data.translation != null) {
            var transl = res.data.translation;
            self.setData({
              word: a,
              phon: '无音标',
              test: transl
            })
          }
          else
            self.setData({
              word: a,
              test: ["未查到"]
            })
          self.setData({
            speakurl: res.data.speakUrl,

          })

        },
        fail: function (res) {
          console.log('getdata.() fail');
        },
        complete: function (res) {
          console.log('getdata.() complete');

        }


      })

    }
  },

  know(){
    var wordList = this.data.wordList;
    var listZero = this.data.wordListZero;
    var listOne = this.data.wordListOne;
    var zeroNowSize = this.data.zeroNowSize;
    var oneNowSize = this.data.oneNowSize;
    var showState = this.data.showState;
    if(showState == 0){
      console.log("00000",listZero)
      console.log("00001", zeroNowSize)
      console.log("00002", oneNowSize)
      wordList[listZero[zeroNowSize]].state=1;
      listOne.push(listZero[zeroNowSize]);
      zeroNowSize++;
      if(zeroNowSize == listZero.length){
        this.setData({
          showState:1
        })
      }
      this.setData({
        wordList:wordList,
        zeroNowSize: zeroNowSize,
        listOne:listOne,
      })
    }else if(showState == 1){
      wordList[listOne[oneNowSize]].state=2
       oneNowSize++;
       if(oneNowSize == listOne.length){
         this.setData({
           showState: 2
         })
       }
       this.setData({
         oneNowSize:oneNowSize,
         wordList:wordList
       })   
    }
    console.log("wordList",this.data.wordList)
    this.setData({
      ishive:false
    })
  },
  unknow(){
    var wordList = this.data.wordList;
    var listZero = this.data.wordListZero;
    var listOne = this.data.wordListOne;
    var zeroNowSize = this.data.zeroNowSize;
    var oneNowSize = this.data.oneNowSize;
    var showState = this.data.showState;
    if(showState == 0){
      listZero.push(listZero[zeroNowSize])
       zeroNowSize++;
       this.setData({
         wordListZero:listZero,
         zeroNowSize:zeroNowSize
       })
    }else if(showState == 1){
      listOne.push(listOne[oneNowSize])
      oneNowSize++;
      this.setData({
        wordListOne:listOne,
        oneNowSize:oneNowSize
      })
    }
    console.log("listzzzz"+listZero)
    console.log("listoooo"+listOne)
    this.setData({
      ishive: false
    })
  },
next(){
  var wordList = this.data.wordList;
  var listZero = this.data.wordListZero;
  var listOne = this.data.wordListOne;
  var zeroNowSize = this.data.zeroNowSize;
  var oneNowSize = this.data.oneNowSize;
  var showState = this.data.showState;
  if(showState == 0){
    this.setData({
      word:wordList[listZero[zeroNowSize]].word
    })
    this.searchWord();
  } else if(showState ==1){
    this.setData({
      word: wordList[listOne[oneNowSize]].word
    })
    this.searchWord();
  }
  this.setData({
    ishive: true
  })
},
submitResult(){
  var that = this;
  that.setData({
    canOnUnload:false
  })
  wx.request({
    url: app.globalData.baseURL +'/word/wordSubmission',
    data:{
      userId: that.data.user.userId,
      wordList:that.data.wordList
    },
    method:'POST',
    success:function(res){
      wx.reLaunch({
             url: '../vocabulary/vocabulary',
           })
    }
  })
}


})