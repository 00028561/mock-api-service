const Mock = require('mockjs');

// 生成用户数据
exports.generateUsers = () => {
  return Mock.mock({
    'users|20': [
      {
        'id|+1': 1,
        'username': '@cname',
        'avatar': '@image(100x100, @color, @name)',
        'email': '@email',
        'phone': /^1[3-9]\d{9}$/
      }
    ]
  }).users;
};

// 生成文章数据
exports.generateArticles = (page = 1, size = 10) => {
  const total = 30;
  const start = (page - 1) * size;
  const end = Math.min(start + size, total);
  
  const articles = Mock.mock({
    'articles|30': [
      {
        'id|+1': 1,
        'title': '@title(5, 10)',
        'content': '@paragraph(3, 8)',
        'author': '@cname',
        'createTime': '@date("yyyy-MM-dd HH:mm:ss")'
      }
    ]
  }).articles;
  
  return {
    list: articles.slice(start, end),
    total,
    page,
    size
  };
};

// 生成商品数据
exports.generateGoods = () => {
  return Mock.mock({
    'goods|15': [
      {
        'id|+1': 1,
        'name': '@ctitle(3, 6)',
        'price': '@float(10, 1000, 2, 2)',
        'imgUrl': '@image(200x200, @color, @name)',
        'stock': '@integer(0, 1000)'
      }
    ]
  }).goods;
};

// 生成评论数据
exports.generateComment = (postId, content, userId) => {
  return {
    id: Mock.Random.integer(1000, 9999),
    postId,
    content,
    userId,
    createTime: new Date().toISOString()
  };
};