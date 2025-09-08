// 后台脚本：负责插件初始化和配置管理

// 安装插件时，初始化Kimi配置到storage
chrome.runtime.onInstalled.addListener(() => {
  // 读取本地kimi.config.json
  fetch(chrome.runtime.getURL('kimi.config.json'))
    .then(res => res.json())
    .then(config => {
      // 存储到chrome.storage.local
      chrome.storage.local.set({ kimi_config: config });
    });
}); 