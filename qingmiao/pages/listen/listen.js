const util = require('../../utils/util.js')
const backgroundAudioManager = wx.getBackgroundAudioManager()

let animation = wx.createAnimation({
  duration: 200,
  timingFunction: 'linear',
  delay: 0,
  transformOrigin: '"50% 50% 0"',
})
let rotateNum = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    play: false,
    slider_value: 0,//设置初始滑块位置为0
    url:'http://mp3.9ku.com/m4a/197118.m4a',
    nowtime: '00:00',
    endtime: '00:00',
    musicMin: 0,
    musicMax: 0,
    activeTime: 0,
    musicName: 'Firefly',
    animation1: '',
    rotateNum: 0.01
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      slider_value: 0,
      nowtime: '00:00'
    });
    this.getAudioDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    backgroundAudioManager.stop()//退出页面时，暂停音频
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onHide: function(e){
    backgroundAudioManager.pause()//退出页面时，暂停音频
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我正在听bo故事,你也一起来听听看吧',
      imageUrl: 'https://goss.veer.com/creative/vcg/veer/612/veer-145663490.jpg'
    }
  },

  getAudioDetail: function(e){
    const page = this
    backgroundAudioManager.src = this.data.url
    backgroundAudioManager.title = 'Firefly'
    backgroundAudioManager.singer = '兴尧'
    backgroundAudioManager.coverImgUrl = 'https://goss.veer.com/creative/vcg/veer/612/veer-145663490.jpg'
    
    //监听音乐可以播放时
    backgroundAudioManager.onCanplay(function(){
      let musicMax = backgroundAudioManager.duration.toFixed(0)
      let musicL = util.formatTime2(musicMax)
      page.setData({
        endtime: musicL,
        musicMax: musicMax
      })
    })
    //监听播放开始
    backgroundAudioManager.onPlay(function(){
      
      page.setData({
        play: true,
      })
      //监听音乐进程
      backgroundAudioManager.onTimeUpdate(function (e) {
        // console.log(backgroundAudioManager.currentTime)
        var time = backgroundAudioManager.currentTime.toFixed(0)
        var activeTime = backgroundAudioManager.currentTime.toFixed(3)
        let time2 = util.formatTime2(time)
        page.setData({
          nowtime: time2,
          slider_value: time,
          activeTime: activeTime
        })
        setInterval(function () {
          if (backgroundAudioManager.duration != backgroundAudioManager.currentTime) {
            if (page.data.play == true) page.data.rotateNum += 0.3
            animation.rotateZ(page.data.rotateNum).step()
            page.setData({
              animation1: animation.export()
            })
          }
        }, 200)
      })
    })
    //监听播放停止
    backgroundAudioManager.onStop(function(){

      page.setData({
        play: false,
        activeTime: 0,
        nowtime: '00:00',
        slider_value: 0
      })
    })
    //监听播放暂停
    backgroundAudioManager.onPause(function(){
      page.setData({
        play: false
      })
    })
    //监听播放结束
    backgroundAudioManager.onEnded(function(){
      page.setData({
        play: false,
        activeTime: 0,
        nowtime: '00:00',
        slider_value: 0
      })
    })
  },
  //监听滚动条
  listenerSlider: function(e){
    console.log(e.detail.value)
    backgroundAudioManager.seek(e.detail.value)
  },
  //点击停止
  musicStop: function(e){
    backgroundAudioManager.pause()
  },
  //点击播放
  musicPlay: function(e){
    if (this.data.activeTime == 0){
      backgroundAudioManager.src = this.data.url
      backgroundAudioManager.title = 'bo故事'
    } else {
      backgroundAudioManager.play()
    }
  }
})