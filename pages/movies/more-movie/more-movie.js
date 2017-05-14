// pages/movies/more-movie/more-movie.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({
  data: {
    // 因为这里的movies是要初始化页面的,所以这里必须要先创建一个键名和键值,这和平时注册的其余变量不同
    movies: {},
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var category = options.category;
    console.log(category);
    this.setData({
      category: category
    });
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case "豆瓣top250":
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    }
    this.setData({
      requestUrl: dataUrl
    });
    util.http(dataUrl, this.processDoubanData);
  },
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    // 在当前页面的导航条中显示一个旋转的loading加载动画效果
    // 写在这里就是当发起下拉请求的时候开始显示导航栏加载动画效果
    wx.showNavigationBarLoading();
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start=0$count=20";
    this.setData({
      movies: {}
    })
    this.setData({
      isEmpty: true
    });
    this.setData({
      totalCount: 0
    })
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    var total = this.data.totalCount;
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars)
      }
      movies.push(temp);
    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      // 将新查找到的电影追加到之前的电影后面
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.setData({
        isEmpty: false
      })
    }
    this.setData({
      // 这里的movies数组包含了至少20个遍历到的电影对象
      movies: totalMovies
    });
    // 关闭之前在下拉的时候开启的导航栏旋转动画
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.setData({
      totalCount: total + 20
    })
  },
  onReady: function (event) {
    var that = this;
    wx.setNavigationBarTitle({
      title: that.data.category
    })
  }
})