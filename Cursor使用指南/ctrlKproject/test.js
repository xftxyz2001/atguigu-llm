/**
 * 用户登录方法
 * @param {Object} params - 登录参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @returns {Promise} 返回登录结果
 */
const zwf_login = async (params) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 用户注册方法
 * @param {Object} params - 注册参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @param {string} params.email - 邮箱
 * @returns {Promise} 返回注册结果
 */
const zwf_register = async (params) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};
