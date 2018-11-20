// pages/medicine/medicine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    medicine: [
      {
        name: '提交申请',
        url: '../commitMedicine/commitMedicine'
      },
      {
        name: '查看进行中',
        url: '../medicineing/medicineing'
      },
      {
        name: '查看记录',
        url: '../medicineHistory/medicineHistory'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  go: function (e){
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  }
})