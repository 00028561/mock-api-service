// API Key 鉴权模块

// API Key 列表（可手动修改）
const apiKeys = {
  // 免费版：QPS=1, 日调用=1000次
  'free_123456': {
    tier: 'free',
    qps: 1,
    dailyLimit: 1000
  },
  // 基础付费版：QPS=10, 日调用=10万次
  'paid_basic_7890': {
    tier: 'basic',
    qps: 10,
    dailyLimit: 100000
  },
  // 专业版：QPS=10, 日调用=10万次
  'paid_pro_0000': {
    tier: 'pro',
    qps: 10,
    dailyLimit: 100000
  }
};

// 调用计数存储（内存存储，重启后会重置）
const usageCounter = {};

// 初始化调用计数
function initUsageCounter() {
  Object.keys(apiKeys).forEach(key => {
    usageCounter[key] = {
      dailyCount: 0,
      lastReset: new Date().toDateString(),
      recentCalls: [] // 用于计算 QPS
    };
  });
}

// 重置每日调用计数
function resetDailyCount() {
  const today = new Date().toDateString();
  Object.keys(usageCounter).forEach(key => {
    if (usageCounter[key].lastReset !== today) {
      usageCounter[key].dailyCount = 0;
      usageCounter[key].lastReset = today;
    }
  });
}

// 验证 API Key 的中间件
function verifyApiKey(req, res, next) {
  // 重置每日调用计数
  resetDailyCount();
  
  // 获取 API Key
  const apiKey = req.headers['x-api-key'];
  
  // 检查是否存在 API Key
  if (!apiKey) {
    return res.status(401).json({ code: 401, msg: '请使用有效 API Key' });
  }
  
  // 检查 API Key 是否有效
  if (!apiKeys[apiKey]) {
    return res.status(401).json({ code: 401, msg: '请使用有效 API Key' });
  }
  
  // 检查每日调用限制
  if (usageCounter[apiKey].dailyCount >= apiKeys[apiKey].dailyLimit) {
    return res.status(429).json({ code: 429, msg: '调用次数已达上限，请升级套餐' });
  }
  
  // 检查 QPS 限制
  const now = Date.now();
  const recentCalls = usageCounter[apiKey].recentCalls.filter(timestamp => now - timestamp < 1000);
  
  if (recentCalls.length >= apiKeys[apiKey].qps) {
    return res.status(429).json({ code: 429, msg: '调用次数已达上限，请升级套餐' });
  }
  
  // 更新调用计数
  usageCounter[apiKey].dailyCount++;
  usageCounter[apiKey].recentCalls = [...recentCalls, now];
  
  // 将 API Key 信息添加到请求对象
  req.apiKeyInfo = {
    key: apiKey,
    tier: apiKeys[apiKey].tier,
    usage: usageCounter[apiKey].dailyCount,
    limit: apiKeys[apiKey].dailyLimit
  };
  
  next();
}

// 获取 API Key 信息
function getApiKeyInfo(apiKey) {
  return apiKeys[apiKey];
}

// 初始化
initUsageCounter();

module.exports = {
  verifyApiKey,
  getApiKeyInfo,
  apiKeys
};