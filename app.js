const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

// 创建 Express 应用实例
const app = express();

// 配置 CORS 中间件，支持跨域
app.use(cors());

// 配置 JSON 解析中间件
app.use(express.json());

// 配置 URL 编码解析中间件
app.use(express.urlencoded({ extended: true }));

// 引入 API 路由
app.use('/api', apiRoutes);

// 健康检查根路径
app.get('/', (req, res) => {
  res.json({ 
    message: 'Frontend Mock API Server is running',
    docs: 'http://localhost:3000/api/docs',
    health: 'http://localhost:3000/api/health'
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ code: 404, msg: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, msg: '服务器内部错误' });
});

// 端口配置
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});