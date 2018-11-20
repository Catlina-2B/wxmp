// pages/medicineHistory/medicineHistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childList: [
      {
        name: '李司棋',
        date: '2018-05-05',
        url: ''
      },
      {
        name: '李司棋',
        date: '2018-05-05',
        url: ''
      },
      {
        name: '李司棋',
        date: '2018-05-05',
        url: ''
      }
    ],
    noImg: 'bdhead.oss-cn-beijing.aliyuncs.com/1541064112033.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goDetail: function(e){
    wx.navigateTo({
      url: '../medicineing/medicineing',
    })
  }
})