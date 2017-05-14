var postsData = require("../../../data/posts-data.js");
var app = getApp();

Page({
  data: {
    isPlayingMusic: false
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var postId = options.id;
    this.setData({
      postId: postId
    });
    var postData = postsData.postList[postId];
    // 将变量注册进页面中
    this.setData(postData);

    var postsCollected = wx.getStorageSync('posts_Collected');
    if (postsCollected) {
      // 注意这里如果之前没有读过postId对应的文章,那这里得到的就是undefined,而undefined在布尔中会被转成false,所以显示效果还是未收藏
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      });
    } else {
      // 页面初始化的时候先创建一个空对象用来在将来存储缓存对象
      var postsCollected = {};
      // 既然存储缓存的对象都没有，那任何文章的缓存肯定也没有，所以这里直接设置成false
      postsCollected[postId] = false;
      // 设置缓存
      wx.setStorageSync('posts_Collected', postsCollected);
    };

    // 如果全局变量为真,说明音乐正在播放,则修改用来做本地数据绑定的变量isPlayingMusic的值,则间接改变页面显示状态
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    // 监听音乐播放和暂停的函数
    this.setMusicMonitor();

  },

  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.data.postId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
    // 当音乐停止,让MINA框架来调用方法帮助我们完成
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },

  onCollectionTap: function (event) {
    // 先从缓存中取出当前文章的缓存状态
    var postsCollected = wx.getStorageSync('posts_Collected');
    var postCollected = postsCollected[this.data.postId];
    console.log(postCollected);
    // 点击按钮后,当前被关注的文章就要取消关注,没关注的文章就要添加关注
    postCollected = !postCollected;
    // 更新存储缓存对象的对象中指定的缓存对象的状态
    postsCollected[this.data.postId] = postCollected;
    this.showToast(postsCollected, postCollected);

  },

  showToast: function (postsCollected, postCollected) {
    wx.setStorageSync("posts_Collected", postsCollected);
    // 更新data数据,这样才能保证在对应的页面中展现出最新的状态
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功"
    })
  },

  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏该文章??" : "取消收藏该文章??",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("posts_Collected", postsCollected);
          // 更新data数据,这样才能保证在对应的页面中展现出最新的状态
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "现在无法实现分享功能"
        })
      }
    })
  },

  onMusicTap: function (event) {
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[this.data.postId].music.url,
        title: postsData.postList[this.data.postId].music.title,
        coverImgUrl: postsData.postList[this.data.postId].music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      });
    }
  }
})