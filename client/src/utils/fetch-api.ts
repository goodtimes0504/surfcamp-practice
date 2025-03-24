/**
 * Next.js 特有的请求配置类型
 * @property revalidate - 重新验证时间(秒)，false 表示禁用重新验证
 * @property tags - 缓存标签数组，用于选择性地重新验证数据
 */
type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

/**
 * API 请求配置接口
 * @property method - HTTP 请求方法
 * @property authToken - 可选的认证令牌
 * @property body - 可选的请求体数据
 * @property next - 可选的 Next.js 特定配置
 */
interface FetchAPIOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  authToken?: string;
  body?: Record<string, unknown>;
  next?: NextFetchRequestConfig;
}

/**
 * 通用 API 请求函数
 * @param url - 请求的 URL 地址
 * @param options - 请求配置选项
 * @returns 返回 JSON 响应数据或状态信息
 * @throws 当网络请求失败时抛出错误
 */
export async function fetchAPI(url: string, options: FetchAPIOptions) {
  const { method, authToken, body, next } = options;

  // 更好的写法 - 重命名为 requestConfig
  const requestConfig: RequestInit & { next?: NextFetchRequestConfig } = {
    // 请求方法
    method,
    
    // 请求头
    headers: {
      "Content-Type": "application/json",
      // 如果存在 authToken，添加 Authorization 头
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    
    // 请求体（不是放在header里，而是作为单独的配置项）
    ...(body && { body: JSON.stringify(body) }),
    
    // Next.js 特殊配置
    ...(next && { next }),
  };

  try {
    // 发送请求
    const response = await fetch(url, requestConfig);
    const contentType = response.headers.get("content-type");

    // 检查响应类型和状态
    if (
      contentType &&
      contentType.includes("application/json") &&
      response.ok
    ) {
      // 如果是成功的 JSON 响应，解析并返回数据
      return await response.json();
    } else {
      // 如果不是 JSON 或请求不成功，返回状态信息
      return { status: response.status, statusText: response.statusText };
    }
  } catch (error) {
    // 捕获并记录网络错误
    console.error(`Error ${method} data:`, error);
    throw error; // 向上抛出错误，让调用者处理
  }
}