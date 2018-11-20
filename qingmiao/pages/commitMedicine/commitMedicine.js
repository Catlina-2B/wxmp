// pages/commitMedicine/commitMedicine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-09-01',
    add: '../../images/add.png',
    medicineTime: [
      { time: '12:01' },
      { time: '12:01' },
      { time: '12:01' },
    ],
    childName: '李思琪'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    const index = e.currentTarget.dataset.index
    const this_ = 'medicineTime[' + index + '].time'
    this.setData({
      [this_]: e.detail.value
    })
  },

  add: function(){
    const newObj = {
      time: '12:01'
    }
    const oldArray = this.data.medicineTime
    oldArray.push(newObj)
    console.log(oldArray)
    this.setData({
      medicineTime: oldArray
    })
  },

  submit: function (){

  }
})