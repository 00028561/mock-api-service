const express = require('express');
const router = express.Router();
const { generateUsers, generateArticles, generateGoods, generateComment } = require('../utils/mockData');
const { verifyApiKey } = require('../utils/auth');
const { rateLimitByApiKey } = require('../utils/rateLimit');

// 不需要鉴权的接口

// GET /api/health - 健康检查接口
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /api/docs - 文档接口
router.get('/docs', (req, res) => {
  res.json({
    message: 'API 文档',
    endpoints: [
      {
        path: '/api/health',
        method: 'GET',
        description: '健康检查接口',
        requiresAuth: false
      },
      {
        path: '/api/docs',
        method: 'GET',
        description: 'API 文档',
        requiresAuth: false
      },
      {
        path: '/api/users',
        method: 'GET',
        description: '获取用户列表',
        requiresAuth: true
      },
      {
        path: '/api/articles',
        method: 'GET',
        description: '获取文章列表（支持分页）',
        requiresAuth: true
      },
      {
        path: '/api/goods',
        method: 'GET',
        description: '获取商品列表',
        requiresAuth: true
      },
      {
        path: '/api/comment',
        method: 'POST',
        description: '提交评论',
        requiresAuth: true
      }
    ],
    apiKeys: {
      free: 'free_123456',
      basic: 'paid_basic_7890',
      pro: 'paid_pro_0000'
    }
  });
});

// 需要鉴权的接口
// 应用鉴权和限流中间件
router.use(['/users', '/articles', '/goods', '/comment'], verifyApiKey, rateLimitByApiKey);

// GET /api/users - 返回 20 条用户数据
router.get('/users', (req, res) => {
  try {
    const users = generateUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/articles - 返回 30 条文章数据，支持 page/size 分页参数
router.get('/articles', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const articles = generateArticles(page, size);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/goods - 返回 15 条商品数据
router.get('/goods', (req, res) => {
  try {
    const goods = generateGoods();
    res.json(goods);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/comment - 接收 postId、content、userId，返回评论成功信息
router.post('/comment', (req, res) => {
  try {
    const { postId, content, userId } = req.body;
    
    // 验证参数
    if (!postId || !content || !userId) {
      return res.status(400).json({ code: 400, msg: 'Missing required parameters' });
    }
    
    const comment = generateComment(postId, content, userId);
    res.json({ code: 200, msg: '评论成功', data: comment });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;