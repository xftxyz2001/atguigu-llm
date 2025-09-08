/**
 * 用户登录方法
 * @param {Object} params - 登录参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @returns {Promise} 登录结果
 */
const zwf_login = async (params) => {
    try {
      const response = await request.post('/api/login', params);
      return response.data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };
  
  /**
   * 用户注册方法
   * @param {Object} params - 注册参数对象
   * @param {string} params.username - 用户名
   * @param {string} params.password - 密码
   * @param {string} params.email - 邮箱
   * @returns {Promise} 注册结果
   */
  const zwf_register = async (params) => {
    try {
      // 发送POST请求到注册接口
      const response = await request.post('/api/register', params);
      // 返回注册结果数据
      return response.data;
    } catch (error) {
      // 捕获并记录注册过程中的错误
      console.error('注册失败:', error);
      // 向上抛出错误，让调用者处理
      throw error;
    }
  };
  