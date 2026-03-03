// 限流模块

// 通用的内存存储限流实现
class RateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 100;
    this.windowMs = options.windowMs || 60000; // 默认 1 分钟
    this.store = new Map();
  }

  // 检查是否允许请求
  check(key) {
    const now = Date.now();
    const stored = this.store.get(key);

    if (!stored) {
      // 首次请求
      this.store.set(key, {
        count: 1,
        windowStart: now
      });
      return true;
    }

    // 检查时间窗口是否过期
    if (now - stored.windowStart > this.windowMs) {
      // 重置计数器
      this.store.set(key, {
        count: 1,
        windowStart: now
      });
      return true;
    }

    // 检查是否超过限制
    if (stored.count >= this.maxRequests) {
      return false;
    }

    // 增加计数
    stored.count++;
    this.store.set(key, stored);
    return true;
  }

  // 获取剩余请求次数
  getRemaining(key) {
    const now = Date.now();
    const stored = this.store.get(key);

    if (!stored || now - stored.windowStart > this.windowMs) {
      return this.maxRequests;
    }

    return this.maxRequests - stored.count;
  }

  // 清理过期的记录
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (now - value.windowStart > this.windowMs) {
        this.store.delete(key);
      }
    }
  }
}

// 创建不同级别的限流器
const limiters = {
  // 免费版限流器
  free: new RateLimiter({
    maxRequests: 1, // QPS=1
    windowMs: 1000 // 1秒窗口
  }),
  // 付费版限流器
  paid: new RateLimiter({
    maxRequests: 10, // QPS=10
    windowMs: 1000 // 1秒窗口
  })
};

// 基于 API Key 级别的限流中间件
function rateLimitByApiKey(req, res, next) {
  // 清理过期记录
  Object.values(limiters).forEach(limiter => limiter.cleanup());
  
  // 从请求对象中获取 API Key 信息
  if (!req.apiKeyInfo) {
    return next();
  }
  
  const { key, tier } = req.apiKeyInfo;
  const limiter = tier === 'free' ? limiters.free : limiters.paid;
  
  // 检查是否允许请求
  if (!limiter.check(key)) {
    return res.status(429).json({ code: 429, msg: '调用次数已达上限，请升级套餐' });
  }
  
  // 添加剩余请求次数到响应头
  res.setHeader('X-RateLimit-Remaining', limiter.getRemaining(key));
  
  next();
}

module.exports = {
  RateLimiter,
  rateLimitByApiKey,
  limiters
};