# 前端 Mock 测试数据 API 项目（带 API Key 鉴权和限流）

这是一个使用 Node.js + Express 搭建的前端 Mock 测试数据 API 项目，提供了 5 个核心接口，支持 API Key 鉴权和调用限流，用于前端开发时的测试数据模拟。

## 项目结构

```
├── app.js              # 应用入口文件
├── routes/
│   └── api.js          # API 路由文件
├── utils/
│   ├── mockData.js     # 模拟数据生成工具
│   ├── auth.js         # API Key 鉴权模块
│   └── rateLimit.js    # 调用限流模块
├── package.json        # 项目配置和依赖
└── README.md           # 项目说明文档
```

## 依赖项

- express: ^4.18.2
- cors: ^2.8.5
- uuid: ^9.0.1
- mockjs: ^1.1.0
- express-rate-limit: ^7.1.5
- express-validator: ^7.0.1

## 接口文档

### 1. GET /api/health
- **功能**: 健康检查接口
- **是否需要鉴权**: 否
- **响应格式**:
  ```json
  {
    "status": "ok"
  }
  ```

### 2. GET /api/docs
- **功能**: API 文档接口
- **是否需要鉴权**: 否
- **响应格式**:
  ```json
  {
    "message": "API 文档",
    "endpoints": [...],
    "apiKeys": {
      "free": "free_123456",
      "basic": "paid_basic_7890",
      "pro": "paid_pro_0000"
    }
  }
  ```

### 3. GET /api/users
- **功能**: 返回 20 条用户数据
- **是否需要鉴权**: 是（请求头需携带 X-API-Key）
- **响应格式**:
  ```json
  [
    {
      "id": 1,
      "username": "张三",
      "avatar": "http://dummyimage.com/100x100/f28d79&text=Nancy Jones",
      "email": "p.ltea@juyyuawbe.中国互联.公司",
      "phone": "18173611186"
    },
    // 更多用户数据...
  ]
  ```

### 4. GET /api/articles
- **功能**: 返回 30 条文章数据，支持分页
- **是否需要鉴权**: 是（请求头需携带 X-API-Key）
- **查询参数**:
  - `page`: 页码，默认 1
  - `size`: 每页数量，默认 10
- **响应格式**:
  ```json
  {
    "list": [
      {
        "id": 1,
        "title": "示例文章标题",
        "content": "这是文章内容...",
        "author": "李四",
        "createTime": "2024-01-01 12:00:00"
      },
      // 更多文章数据...
    ],
    "total": 30,
    "page": 1,
    "size": 10
  }
  ```

### 5. GET /api/goods
- **功能**: 返回 15 条商品数据
- **是否需要鉴权**: 是（请求头需携带 X-API-Key）
- **响应格式**:
  ```json
  [
    {
      "id": 1,
      "name": "商品名称",
      "price": 99.99,
      "imgUrl": "http://dummyimage.com/200x200/79f2a1&text=商品名称",
      "stock": 100
    },
    // 更多商品数据...
  ]
  ```

### 6. POST /api/comment
- **功能**: 提交评论
- **是否需要鉴权**: 是（请求头需携带 X-API-Key）
- **请求体**:
  ```json
  {
    "postId": 1,
    "content": "评论内容",
    "userId": 1
  }
  ```
- **响应格式**:
  ```json
  {
    "code": 200,
    "msg": "评论成功",
    "data": {
      "id": 1234,
      "postId": 1,
      "content": "评论内容",
      "userId": 1,
      "createTime": "2024-01-01T12:00:00.000Z"
    }
  }
  ```

## API Key 申请方式

### 测试 API Key
以下是测试用的 API Key，可直接使用：
- 免费版：`free_123456`
- 基础付费版：`paid_basic_7890`
- 专业版：`paid_pro_0000`

### 正式 API Key 申请
1. 访问 [爱发电](https://afdian.net/@mockapi) 支持项目
2. 选择对应套餐并完成支付
3. 联系管理员获取专属 API Key

## 收费套餐

| 套餐类型 | QPS 限制 | 日调用限制 | 价格 | 购买链接 |
|---------|---------|-----------|------|----------|
| 免费版 | 1 | 1000 次 | ¥0 | 内置测试 Key |
| 基础版 | 10 | 10 万次 | ¥9.9/月 | [购买链接](https://afdian.net/item/基础版API)
| 专业版 | 10 | 10 万次 | ¥19.9/月 | [购买链接](https://afdian.net/item/专业版API)
| 企业版 | 50 | 100 万次 | ¥99/月 | [购买链接](https://afdian.net/item/企业版API)

## 本地运行步骤

1. 克隆项目到本地
2. 进入项目目录
3. 安装依赖：
   ```bash
   npm install
   ```
4. 启动服务器：
   ```bash
   npm run dev
   ```
5. 服务器将在 http://localhost:3000 上运行

## 部署说明

### 1. 本地部署
- 按照本地运行步骤操作即可

### 2. 服务器部署
1. 确保服务器上安装了 Node.js（推荐 v14+）
2. 将项目文件上传到服务器
3. 安装依赖：
   ```bash
   npm install
   ```
4. 启动服务器：
   ```bash
   npm start
   ```
5. 建议使用 PM2 等进程管理工具来管理服务：
   ```bash
   # 安装 PM2
   npm install -g pm2
   
   # 启动服务
   pm2 start app.js --name mock-api
   
   # 查看状态
   pm2 status
   ```

### 3. Docker 部署
1. 创建 Dockerfile：
   ```dockerfile
   FROM node:14-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["node", "app.js"]
   ```
2. 构建镜像：
   ```bash
   docker build -t mock-api .
   ```
3. 运行容器：
   ```bash
   docker run -p 3000:3000 --name mock-api-container mock-api
   ```

## API Key 管理

### 添加新的 API Key
编辑 `utils/auth.js` 文件，在 `apiKeys` 对象中添加新的 API Key：

```javascript
const apiKeys = {
  // 现有 Key
  'free_123456': {
    tier: 'free',
    qps: 1,
    dailyLimit: 1000
  },
  // 新添加的 Key
  'new_api_key': {
    tier: 'basic', // 套餐等级：free, basic, pro
    qps: 10, // QPS 限制
    dailyLimit: 100000 // 日调用限制
  }
};
```

### 查看 API Key 使用情况
API Key 的使用情况会在服务器日志中显示，也可以通过修改代码添加监控接口来查看详细使用情况。

## 常见问题

### 1. 如何在请求中添加 API Key？
在 HTTP 请求头中添加 `X-API-Key` 字段，例如：
```
X-API-Key: free_123456
```

### 2. 遇到 401 错误怎么办？
- 检查 API Key 是否正确
- 检查 API Key 是否过期
- 检查请求头是否正确设置

### 3. 遇到 429 错误怎么办？
- 检查是否超过了 QPS 限制
- 检查是否超过了日调用限制
- 考虑升级套餐

### 4. 如何自定义 API Key 的限制？
编辑 `utils/auth.js` 文件，修改对应 API Key 的 `qps` 和 `dailyLimit` 值。

## 许可证

MIT 许可证，可自由商用。

## 联系我们

- 项目地址：[GitHub](https://github.com/username/mock-api)
- 爱发电：[支持项目](https://afdian.net/@mockapi)
- 邮箱：contact@mockapi.com
