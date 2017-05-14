var util = require("../../utils/util.js");
var app = getApp();
Page({
  data:{
    //String1
    // 这里这三个键名是必须存在的,否则在'movies.wxml'页面初始化的时候在'data'属性中是找不到这几个属性的
    inTheaters:{},
    comingSoon:{},
    top250:{},
    containerShow:true,
    searchPanelShow:false,
    searchResult:{}
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var inTheaterUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + "?start=0&count=3";
    var top250 = app.globalData.doubanBase + '/v2/movie/top250' + "?start=0&count=3";

    this.getMovieListData(inTheaterUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250,"top250","豆瓣top250");
  },
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: './more-movie/more-movie?category=' + category,
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },
  // 访问豆瓣的公共方法
  getMovieListData:function(url,settedKey,categoryTitle){
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type":"application/xml"
      }, // 设置请求的 header
      success: function(res){
        that.processDoubanData(res.data,settedKey,categoryTitle);
      },
      fail: function(res) {
        // fail
      }
    })
  },
  onCancelImgTap:function(event){
    this.setData({
      containerShow:true,
      searchPanelShow:false,
      searchResult:{}
    })
  },
  onBindFocus:function(event){
    // 当搜索框获取焦点的时候,将表示显示普通页面的变量设置成false,将表示搜索页面的变量设置成true
    this.setData({
      containerShow:false,
      searchPanelShow:true
    });
  },
  onBindChange:function(event){
    // 获取用户在文本框所输入的搜索文本
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    // 将一个名为'searchResult'的对象绑定到data里,然后就可以在模板中使用绑定的变量
    this.getMovieListData(searchUrl,"searchResult","")
  },
  // 将从豆瓣获取到的数据注册进页面中来替换页面中的变量
  // 第一个参数是要遍历的对象、第二个参数是遍历后的结果注册进data中的键名、第三个参数是和遍历后的结果结合一起注入
  processDoubanData:function(moviesDouban,settedKey,categoryTitle){
    var movies = [];
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0,6) + "...";
      }
      var temp = {
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id,
        stars:util.convertToStarsArray(subject.rating.stars)
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle:categoryTitle,
      movies:movies
    };
    this.setData(readyData);
  }
})