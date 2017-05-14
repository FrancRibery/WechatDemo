// pages/movies/movie-detail/movie-detail.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({
  data:{
    movie:{}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.id;
    var detailUrl = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    util.http(detailUrl,this.processDoubanData);
  },
  // 参数是从豆瓣中根据指定电影id查找到的详细数据结果
  processDoubanData:function(data){
    if(!data){
      return;
    }
    var director = {
      avatar:"",
      name:"",
      id:""
    }
    if(data.directors[0]!=null){
      if(data.directors[0].avatars!=null){
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    // 对movie对象进行一个填充
    var movie = {
      movieImg:data.images?data.images.large:"",
      country:data.countries[0],
      title:data.title,
      originalTitle:data.original_title,
      wishCount:data.wish_count,
      commentCount:data.comments_count,
      year:data.year,
      generes:data.genres.join("、"),
      stars:util.convertToStarsArray(data.rating.stars),
      score:data.rating.average,
      director:director,
      casts:util.convertToCastString(data.casts),
      castsInfo:util.convertToCastInfos(data.casts),
      summary:data.summary
    }
    // 执行绑定操作
    this.setData({
      movie:movie
    })
  },
  viewMoviePostImg:function(event){
    // 获取用户点击的图片地址
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src] // 当前预览图片的http链接列表
    })
  }
})