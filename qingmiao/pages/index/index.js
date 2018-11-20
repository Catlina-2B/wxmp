//index.js
//获取应用实例
const app = getApp()
const service = require('../../utils/base.js')
const saveFormId = require('../../utils/saveFormId.js')

Page({
  data: {
    message: '登录页',
    imgUrls: [],
    indicatorDots: true,
    indicatorColor: 'rgba(255, 255, 255, 1)',
    indicatorActiveColor: "#87CEFA",
    autoplay: true,
    interval: 3000,
    duration: 500,
    asrc: '',
    service: service.service.baseUrl,
    nav: [
      {
        url: '../kindergartenHub/kindergartenHub',
        imageSrc: '../../images/yuansuohuodong.png',
        text: '园所官网'
      },
      {
        url: '../notice/notice?goId=3',
        imageSrc: '../../images/tongzhitixing.png',
        text: '通知提醒',
        count: 1
      },
      {
        url: '../plan/plan?goId=2',
        imageSrc: '../../images/banjijihua.png',
        text: '班级计划'
      },
      {
        url: '../attendance/attendance',
        imageSrc: '../../images/chuqinguanli.png',
        text: '出勤管理'
      },
      {
        url: '../cookBook/cookBook',
        imageSrc: '../../images/meizhoushipu.png',
        text: '每周食谱'
      },
      {
        url: '../teacher/teacher',
        imageSrc: '../../images/banjijiaoshi.png',
        text: '班级教师'
      },
      // {
      //   url: '../attSeconds/attSeconds',
      //   imageSrc: '../../images/budaka.png',
      //   text: '儿童补录'
      // },
      {
        url: '../dyamic/dyamic?goId=1',
        imageSrc: '../../images/banjixiangce.png',
        text: '班级动态',
        count: 1,
      },
      {
        url: '../homeWork/homeWork',
        imageSrc: '../../images/qinzizuoye.png',
        text: '亲子作业'
      },
      {
        url: '../children/children',
        imageSrc: '../../images/banjiyouer.png',
        text: '班级幼儿'
      },
      {
        url: '../familySchool/familySchool',
        imageSrc: '../../images/jiayuanlianxi.png',
        text: '一周点评',
        count: 1,
      },
      {
        url: '../medicine/medicine',
        imageSrc: '../../images/jiayuanlianxi.png',
        text: '喂药系统'
      }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    if (app.globalData.goId == 3) {
      app.globalData.goId = ''
      wx.navigateTo({
        url: '../notice/notice?goId=3',
      })
    } else if (app.globalData.goId == 2) {
      app.globalData.goId = ''
      wx.navigateTo({
        url: '../plan/plan?goId=2',
      })
    }
    const code = wx.getStorageSync("code")
    const page = this
    this.setData({
      message: code
    })
    app.globalData.userToken = wx.getStorageSync('userToken')
    app.globalData.klassId = wx.getStorageSync('klassId')

  },

  onShow: function(){
    //获取班级动态数量
    this.getFeeds()
    //获取未读通知
    this.getNoticeUnread()
    //获取未反馈点评数量
    this.getFamilySchool()

    app.globalData.userToken = wx.getStorageSync('userToken')
    app.globalData.klassId = wx.getStorageSync('klassId')
    //获取园所图片
    this.getImg()
  },
  
  go: function (e) {
    // console.log(e)
    saveFormId(e.detail.formId)
    const index = e.currentTarget.dataset.id
    let thisUrl = this.data.nav[index].url

    wx.navigateTo({
      url: thisUrl,
    })

    // if(index == 9){
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '该模块暂未更新，敬请期待！',
    //     showCancel: false,
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: thisUrl,
    //   })
    // }
  },

  getFeeds: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    const klassId = wx.getStorageSync('klassId')
    let fromId
    if (wx.getStorageSync('fromId')) fromId = wx.getStorageSync('fromId')
    else fromId = 0
    wx.request({
      url: page.data.service + '/api/klass-feeds/unread?fromId=' + fromId + '&klassId=' + klassId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function(res){
        // console.log(res)
        const count = res.data.count
        page.setData({
          ['nav[6].count']: count
        })
      }
    })
  },

  getNoticeUnread: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    const klassId = wx.getStorageSync('klassId')
    let fromId
    if (wx.getStorageSync('NoticeFromId')) fromId = wx.getStorageSync('NoticeFromId')
    else fromId = 0
    wx.request({
      url: page.data.service + '/api/klass-plans/unread?fromId=' + fromId + '&klassId=' + klassId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        const count = res.data.NOTICE
        page.setData({
          ['nav[1].count']: count
        })
      }
    })
  },

  getFamilySchool: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/weeklyrRemark/management/countUnRead',
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        console.log(res)
        page.setData({
          ['nav[9].count']: res.data
        })
      }
    })
  },

  getImg: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    const schoolId = wx.getStorageSync('schoolId')
    wx.request({
      url: page.data.service + '/management/marquees?schoolId=' + schoolId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function(res){
        // console.log(res)
        const first = 'https://' + res.data[0].firstImg
        const center = 'https://' + res.data[0].centerImg
        const last = 'https://' + res.data[0].lastImg
        page.setData({
          ['imgUrls[0]']: first,
          ['imgUrls[1]']: center,
          ['imgUrls[2]']: last,
        })
      }
    })
  },

  ImgTap: function(e){
    // console.log(e)

    // if(e.currentTarget.dataset.index == 2){
    //   wx.navigateTo({
    //     url: '../wxpay/wxpay',
    //   })
    // }
  },

  getFormId: function(e){
    // console.log(e)
    saveFormId(e.detail.formId)
  }
})
