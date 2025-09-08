// 内容脚本：负责页面交互和悬浮菜单

// 定义全局变量保存悬浮菜单元素
let floatMenu = null;
let resultPanel = null;
let selectedText = '';

// 创建悬浮菜单
function createFloatMenu(x, y) {
    // 如果已存在，先移除
    removeFloatMenu();
    // 创建菜单容器
    floatMenu = document.createElement('div');
    floatMenu.id = 'ai-float-menu';
    floatMenu.style.position = 'absolute';
    floatMenu.style.left = x + 'px';
    floatMenu.style.top = y + 'px';
    floatMenu.style.zIndex = 99999;
    floatMenu.style.background = '#fff';
    floatMenu.style.border = '1px solid #E5E5E5';
    floatMenu.style.borderRadius = '4px';
    floatMenu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    floatMenu.style.padding = '8px';
    floatMenu.style.display = 'flex';
    floatMenu.style.gap = '8px';

    // 添加功能按钮
    const btns = [
        { key: 'explain', label: '🔍 解释' },
        { key: 'translate', label: '🌐 翻译' },
        { key: 'speak', label: '🔊 朗读' },
        { key: 'polish', label: '✏️ 润色' }
    ];
    btns.forEach(btn => {
        const el = document.createElement('button');
        el.innerText = btn.label;
        el.style.fontSize = '14px';
        el.style.border = 'none';
        el.style.background = '#F5F7FA';
        el.style.borderRadius = '4px';
        el.style.cursor = 'pointer';
        el.onmouseenter = () => el.style.background = '#E5EFFF';
        el.onmouseleave = () => el.style.background = '#F5F7FA';
        el.onclick = () => handleMenuClick(btn.key);
        floatMenu.appendChild(el);
    });

    document.body.appendChild(floatMenu);
}

// 移除悬浮菜单和结果面板
function removeFloatMenu() {
    if (floatMenu) {
        floatMenu.remove();
        floatMenu = null;
    }
    if (resultPanel) {
        resultPanel.remove();
        resultPanel = null;
    }
}

// 创建结果展示面板
function showResultPanel(content, editable = false, onReplace = null) {
    if (resultPanel) resultPanel.remove();
    resultPanel = document.createElement('div');
    resultPanel.id = 'ai-result-panel';
    resultPanel.style.position = 'absolute';
    resultPanel.style.left = floatMenu.style.left;
    resultPanel.style.top = (parseInt(floatMenu.style.top) + floatMenu.offsetHeight + 8) + 'px';
    resultPanel.style.zIndex = 99999;
    resultPanel.style.background = '#fff';
    resultPanel.style.border = '1px solid #E5E5E5';
    resultPanel.style.borderRadius = '4px';
    resultPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    resultPanel.style.padding = '12px';
    resultPanel.style.minWidth = '200px';
    resultPanel.style.maxWidth = '400px';
    resultPanel.style.wordBreak = 'break-all';
    resultPanel.style.fontSize = '16px';
    resultPanel.style.color = '#333';
    resultPanel.style.marginTop = '4px';

    if (editable) {
        // 可编辑文本框
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.width = '100%';
        textarea.style.height = '80px';
        textarea.style.fontSize = '16px';
        textarea.style.marginBottom = '8px';
        resultPanel.appendChild(textarea);
        // 替换按钮
        const replaceBtn = document.createElement('button');
        replaceBtn.innerText = '替换原文';
        replaceBtn.style.marginRight = '8px';
        replaceBtn.onclick = () => {
            if (onReplace) onReplace(textarea.value);
        };
        resultPanel.appendChild(replaceBtn);
        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = '取消';
        cancelBtn.onclick = removeFloatMenu;
        resultPanel.appendChild(cancelBtn);
    } else {
        // 普通文本展示
        resultPanel.innerText = content;
    }
    document.body.appendChild(resultPanel);
}

// 处理菜单点击
function handleMenuClick(type) {
    if (!selectedText) return;
    if (type === 'explain') {
        // 调用解释API
        kimiRequest('explain', selectedText, (res) => {
            showResultPanel(res);
        });
    } else if (type === 'translate') {
        // 选择目标语言
        showTranslatePanel();
    } else if (type === 'speak') {
        // 朗读
        speakText(selectedText);
    } else if (type === 'polish') {
        // 润色
        kimiRequest('polish', selectedText, (res) => {
            showResultPanel(res, true, (newText) => {
                replaceSelectedText(newText);
                removeFloatMenu();
            });
        });
    }
}

// 显示翻译语言选择面板
function showTranslatePanel() {
    if (resultPanel) resultPanel.remove();
    resultPanel = document.createElement('div');
    resultPanel.id = 'ai-translate-panel';
    resultPanel.style.position = 'absolute';
    resultPanel.style.left = floatMenu.style.left;
    resultPanel.style.top = (parseInt(floatMenu.style.top) + floatMenu.offsetHeight + 8) + 'px';
    resultPanel.style.zIndex = 99999;
    resultPanel.style.background = '#fff';
    resultPanel.style.border = '1px solid #E5E5E5';
    resultPanel.style.borderRadius = '4px';
    resultPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    resultPanel.style.padding = '12px';
    resultPanel.style.minWidth = '200px';
    resultPanel.style.maxWidth = '400px';
    resultPanel.style.fontSize = '16px';
    resultPanel.style.color = '#333';
    resultPanel.style.marginTop = '4px';

    // 语言选择
    const label = document.createElement('div');
    label.innerText = '目标语言:';
    label.style.marginBottom = '8px';
    resultPanel.appendChild(label);
    ['中文', '英文'].forEach(lang => {
        const btn = document.createElement('button');
        btn.innerText = lang;
        btn.style.marginRight = '8px';
        btn.onclick = () => {
            kimiRequest('translate', selectedText, (res) => {
                showResultPanel(res);
            }, lang);
        };
        resultPanel.appendChild(btn);
    });
    document.body.appendChild(resultPanel);
}

// 调用Kimi API
function kimiRequest(type, text, callback, lang) {
    // 读取配置
    chrome.storage.local.get(['kimi_config'], (result) => {
        const config = result.kimi_config || {};
        const apiUrl = config.api_url || '';
        const apiKey = config.api_key || '';
        if (!apiUrl || !apiKey) {
            showResultPanel('请先在插件设置中填写Kimi API信息！');
            return;
        }
        // 构造prompt
        let prompt = '';
        if (type === 'explain') prompt = `请解释以下内容：${text}`;
        if (type === 'translate') prompt = `请将以下内容翻译为${lang || '中文'}：${text}`;
        if (type === 'polish') prompt = `请润色以下内容：${text}`;
        // 构造moonshot API请求体
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'moonshot-v1-8k', // 如有其它模型可替换
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        })
        .then(res => res.json())
        .then(data => {
            // 解析moonshot返回内容
            const result = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
                ? data.choices[0].message.content
                : '无结果';
            callback(result);
        })
        .catch(() => {
            showResultPanel('请求失败，请检查网络或API信息！');
        });
    });
}

// 朗读功能，调用浏览器内置TTS
function speakText(text) {
    // 判断语言
    const isChinese = /[\u4e00-\u9fa5]/.test(text);
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = isChinese ? 'zh-CN' : 'en-US';
    window.speechSynthesis.speak(utter);
}

// 替换选中的文本（可编辑区域）
function replaceSelectedText(newText) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    // 只在可编辑区域替换
    if (range.startContainer.parentNode.isContentEditable) {
        range.deleteContents();
        range.insertNode(document.createTextNode(newText));
    }
}

// 监听鼠标选中事件
window.addEventListener('mouseup', (e) => {
    setTimeout(() => {
        const sel = window.getSelection();
        const text = sel.toString().trim();
        if (text.length > 0) {
            selectedText = text;
            // 获取选区坐标
            const rect = sel.getRangeAt(0).getBoundingClientRect();
            const x = rect.left + window.scrollX;
            const y = rect.bottom + window.scrollY;
            createFloatMenu(x, y);
        } else {
            removeFloatMenu();
        }
    }, 10);
});

// 鼠标移出菜单自动隐藏
window.addEventListener('mousedown', (e) => {
    if (floatMenu && !floatMenu.contains(e.target) && resultPanel && !resultPanel.contains(e.target)) {
        removeFloatMenu();
    }
}); 