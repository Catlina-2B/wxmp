// pages/regist/regist.js
const app = getApp()
const service = require('../../utils/base.js')
const countActive = require('../../utils/countActive.js')
const config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    canSubmit: false,
    invat: '验证码',
    mobile: '',
    content: '',
    secretcode: '',
    canGetInvat: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp()
    new app.ToastPannel()
    
  },

  openToastPannel: function () {
    this.show(this.data.content)
  },

  mobileChange: function(e){
    // console.log(e.detail.value)
    this.setData({
      mobile: e.detail.value
    })
    if(this.data.mobile != ""){
      this.setData({
        canSubmit: true
      })
    } else {
      this.setData({
        canSubmit: false
      })
    }
  },

  secretcodeChange: function(e){
    // console.log(e.detail.value)
    this.setData({
      secretcode: e.detail.value
    })
  },

  /**
   * 发送验证码
   */
  getInvat: function () {
    if (this.data.canGetInvat == false) return
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if (!(reg.test(this.data.mobile))) {
      this.setData({
        content: '手机号不存在'
      })
      this.openToastPannel()
      return
    }
    const page = this
    wx.request({
      url: page.data.service + '/wxLogin/web/sendMsmCode?mobile=' + page.data.mobile,
      method: 'post',
      success: function (res) {
        console.log(res)
        let t = 20
        page.setData({
          canGetInvat: false
        })
        let timer = setInterval(function () {
          page.setData({
            invat: t + 's'
          })
          if (t == 0) {
            clearInterval(timer)
            page.setData({
              canGetInvat: true,
              invat: '重新发送'
            })
          }
          else t--
        }, 1000)
      }
    })
  },

  /**
   * 提交表单
   */
  formSubmit: function(e){
    
    const page = this
    if(this.data.canSubmit == false) return
    //验证数据格式
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if(!(reg.test(page.data.mobile))){
      this.setData({
        content: '手机号不存在'
      })
      this.openToastPannel()
      return
    }
    if (page.data.secretcode == ''){
      this.setData({
        content: '请输入验证码'
      })
      this.openToastPannel()
      return
    }
    
    this.login()
    
  },

  login: function(){
    const page = this
    const ActiveType = 'LOGIN'
    return new Promise(function(resolve, reject){
      wx.login({
        success: function (res) {
          const code2 = res.code
          // console.log(code2)
          // return
          const mobile = page.data.mobile
          wx.request({
            url: page.data.service + '/wxLogin/web/wxUsersTest?code=' + code2 + '&mobile=' + mobile + '&verificationCode=' + page.data.secretcode,
            method: 'post',
            header: {
              "Content-Type": "application/json"
            },
            success: function (res2) {
              console.log(res2)
              if (res2.statusCode == 200) {
                wx.login({
                  success: function (res3) {
                    wx.request({
                      url: page.data.service + '/wxLogin/web/wxTokens?code=' + res3.code,
                      method: 'post',
                      success: function (res) {
                        console.log(res)
                        // wx.redirectTo({
                        //   url: '../login/login',
                        // })
                        wx.setStorageSync('resData', res.data)
                        // res.statusCode = 500
                        wx.showToast({
                          title: '登录中',
                          icon: 'loading'
                        })
                        if (res.statusCode != 500) {
                          const loginTime = new Date().getTime()
                          wx.setStorageSync('loginTime', loginTime)
                          app.globalData.schoolId = res.data.schools[0].id
                          wx.setStorageSync('schoolId', res.data.schools[0].id)
                          wx.request({
                            url: service.service.baseUrl + '/tokens/school/' + app.globalData.schoolId,
                            header: {
                              Authorization: 'Bearer ' + res.data.token
                            },
                            method: 'post',
                            success: function (res) {
                              // console.log(res)
                              if (res.data.patriarch != null) {
                                if (res.data.patriarch.guardians.length != 0) {
                                  wx.setStorageSync('klassId', res.data.patriarch.guardians[0].klass.id)
                                }
                                wx.setStorageSync('userToken', res.data.token)
                                resolve(res)
                                // countActive(res)
                                countActive(ActiveType, res.data.token)
                                wx.hideToast()
                                wx.switchTab({
                                  url: '../index/index',
                                })
                                
                              } else if (res.data.teacher != null) {
                                wx.setStorageSync('klassId', res.data.teacher.klass[0].id)
                                wx.setStorageSync('userToken', res.data.token)
                                resolve(res)
                                // countActive(res)
                                countActive(ActiveType, res.data.token)
                                wx.hideToast()
                                wx.switchTab({
                                  url: '../index/index',
                                })
                                
                              } else {
                                wx.hideToast()
                                wx.showModal({
                                  title: '温馨提示',
                                  content: '此程序仅限家长与老师使用',
                                  showCancel: false,
                                  success: function () {
                                    wx.setStorageSync('userToken', res.data.token)
                                    // countActive(res)
                                    countActive(ActiveType, res.data.token)
                                    wx.switchTab({
                                      url: '../index/index',
                                    })
                                  }
                                })
                                resolve(res)
                              }
                            }
                          })
                        } else {
                          wx.hideToast()
                          wx.showModal({
                            title: '提示',
                            content: '登录失败，请重新登录',
                            showCancel: false,
                            success: function () {
                              wx.redirectTo({
                                url: '/pages/login/login',
                              })
                            }
                          })
                          reject('error')
                        }
                      }
                    })
                  }
                })
              } else {
                console.log(res)
                wx.showModal({
                  title: '提示',
                  content: '注册失败，请重试',
                })
              }
            },
            fail: function (res){
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '注册失败，请重试',
              })
            }
          })
        }
      })
    }).then(function(res){
      let token1 = wx.getStorageSync('userToken')
      wx.request({
        url: page.data.service + '/api/tp/aliyun/bd-token',
        method: 'get',
        header: {
          Authorization: 'Bearer ' + token1
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 500) {

          } else if (res.statusCode == 200) {
            config.OSSAccessKeyId = res.data.accessKeyId
            config.AccessKeySecret = res.data.accessKeySecret
            config.token = res.data.token
          } else {
            return
          }
        }
      })
    })
  },

  serviceBook: function(){
    wx.navigateTo({
      url: '../serviceBook/serviceBook',
    })
  }
})