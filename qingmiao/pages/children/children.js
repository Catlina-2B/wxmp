
const app = getApp()
const service = require('../../utils/base.js')
const saveFormId = require('../../utils/saveFormId.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    service: service.service.baseUrl,
    nowChildKlass: wx.getStorageSync('klassId')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化一些值
    this.setData({
      klassId: wx.getStorageSync('klassId')
    })

    this.studentInfo()
  },
  /**
   * 查询学生信息
   */
  studentInfo: function () {
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/management/guardians/findChildren',
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        for(var i in res.data){
          res.data[i].student.joinedAt = page.confirmTime(res.data[i].student.joinedAt)
        }
        page.setData({
          list: res.data
        })
      }
    })
  },

  confirmTime: function(time){
    time = time * 1000
    var y = new Date(time).getFullYear()
    var m = new Date(time).getMonth() + 1
    if(m < 10) m = '0' + m
    var d = new Date(time).getDate()
    if(d < 10) d = '0' + d
    return y + '-' + m + '-' + d
  },
  
  getFormId: function (e) {
    saveFormId(e.detail.formId)
  },

  chooseChild: function(e){
    const page = this
    const oldKlassId = wx.getStorage({
      key: 'klassId',
      success: function(res) {
        var index = e.currentTarget.dataset.index
        var klassId = page.data.list[index].student.klass.id
        var schoolId = page.data.list[index].student.klass.schoolId
        wx.setStorageSync('klassId', klassId)
        wx.setStorageSync('schoolId', schoolId)
        if (klassId != oldKlassId){
          wx.setStorageSync('fromId', 0)
          wx.setStorageSync('NoticeFromId', 0)
        }
        page.setData({
          nowChildKlass: klassId
        })
      },
    })
  }
})