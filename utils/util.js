function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [0, 0, 0, 0, 0];
    for (var i = 0; i < num; i++) {
        array[i] = 1;
    }
    return array;
}

// 访问豆瓣的公共方法
function http(url,callback) {
    wx.request({
        url: url,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            "Content-Type": "application/xml"
        }, // 设置请求的 header
        success: function (res) {
            callback(res.data);
        },
        fail: function (res) {
            // fail
        }
    })
}

function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    // 拼接演员组成一栏的内容 
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  // 将最后的'/'符号去掉
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
    convertToStarsArray: convertToStarsArray,
    http:http,
    convertToCastInfos:convertToCastInfos,
    convertToCastString:convertToCastString
}