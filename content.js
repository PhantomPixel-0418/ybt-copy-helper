(function () {
    'use strict';

    // 主函数：为样例添加复制按钮
    function addCopyButtons() {
        // 策略1：查找所有可能是样例的<pre>元素
        const allPreElements = document.querySelectorAll('pre');

        // 过滤出真正的样例元素（排除空的和太短的）
        const sampleElements = Array.from(allPreElements).filter(pre => {
            const text = pre.textContent.trim();
            // 样例通常包含多行或一定长度
            return text.length > 10 && (text.includes('\n') || text.includes(' '));
        });

        // 策略2：查找包含"样例"字样的附近<pre>元素
        const sampleTextElements = document.querySelectorAll('font, span, div, td');
        sampleTextElements.forEach(element => {
            if (element.textContent.includes('样例') &&
                (element.textContent.includes('输入') || element.textContent.includes('输出'))) {
                // 在附近查找<pre>元素
                const parent = element.parentElement;
                if (parent) {
                    const nearbyPres = parent.querySelectorAll('pre');
                    nearbyPres.forEach(pre => {
                        if (!pre.classList.contains('ybt-processed')) {
                            sampleElements.push(pre);
                            pre.classList.add('ybt-processed');
                        }
                    });
                }
            }
        });

        // 去重：基于DOM元素本身去重
        const uniqueElements = [];
        const seenIds = new Set();

        sampleElements.forEach(element => {
            if (!seenIds.has(element.id)) {
                // 为元素添加临时ID以便追踪
                if (!element.id) {
                    element.id = 'ybt-sample-' + Math.random().toString(36).substr(2, 9);
                }
                seenIds.add(element.id);
                uniqueElements.push(element);
            }
        });

        // 为每个样例元素添加复制按钮
        uniqueElements.forEach(element => {
            // 防止重复添加按钮
            if (element.querySelector('.ybt-copy-btn')) return;

            // 创建复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.className = 'ybt-copy-btn';
            copyBtn.textContent = '复制';
            copyBtn.setAttribute('aria-label', '复制样例内容');

            // 更美观的样式
            copyBtn.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                z-index: 10000;
                padding: 4px 12px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 4px;
                opacity: 0.9;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            `;

            // 确保父元素有相对定位
            let parentWithPosition = element;
            while (parentWithPosition && getComputedStyle(parentWithPosition).position === 'static') {
                if (parentWithPosition === document.body) break;
                parentWithPosition = parentWithPosition.parentElement;
            }

            if (getComputedStyle(element).position === 'static') {
                element.style.position = 'relative';
            }

            // 添加按钮到元素
            element.appendChild(copyBtn);

            // 添加按钮交互效果
            copyBtn.addEventListener('mouseenter', () => {
                copyBtn.style.opacity = '1';
                copyBtn.style.transform = 'translateY(-1px)';
                copyBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            });

            copyBtn.addEventListener('mouseleave', () => {
                copyBtn.style.opacity = '0.9';
                copyBtn.style.transform = 'translateY(0)';
                copyBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            });

            // 绑定复制事件
            copyBtn.addEventListener('click', async function (e) {
                e.stopPropagation();
                e.preventDefault();

                // 获取要复制的文本（排除按钮文本）
                const originalContent = element.textContent || element.innerText;
                const textToCopy = originalContent.replace(/复制|已复制|复制失败/g, '').trim();

                try {
                    // 使用现代Clipboard API
                    await navigator.clipboard.writeText(textToCopy);

                    // 复制成功反馈
                    copyBtn.textContent = '✓ 已复制';
                    copyBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
                    copyBtn.style.transform = 'scale(0.95)';

                    // 3秒后恢复
                    setTimeout(() => {
                        copyBtn.textContent = '复制';
                        copyBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        copyBtn.style.transform = 'scale(1)';
                    }, 3000);

                } catch (err) {
                    console.error('复制失败:', err);

                    // 降级方案：使用旧版execCommand
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();

                    const fallbackSuccess = document.execCommand('copy');
                    document.body.removeChild(textArea);

                    if (fallbackSuccess) {
                        copyBtn.textContent = '✓ 已复制';
                        copyBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
                        setTimeout(() => {
                            copyBtn.textContent = '复制';
                            copyBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }, 3000);
                    } else {
                        copyBtn.textContent = '✗ 失败';
                        copyBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #c62828 100%)';
                        setTimeout(() => {
                            copyBtn.textContent = '复制';
                            copyBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }, 3000);
                    }
                }
            });
        });

        if (uniqueElements.length > 0) {
            console.log(`一本通样例复制助手：已为 ${uniqueElements.length} 个样例框添加复制按钮`);
        }
    }

    // 页面加载完成后运行
    function init() {
        // 先等待一小段时间，确保动态内容加载完成
        setTimeout(addCopyButtons, 500);

        // 设置一个间隔，多次尝试（针对动态加载的内容）
        let attempts = 0;
        const maxAttempts = 5;
        const interval = setInterval(() => {
            addCopyButtons();
            attempts++;

            // 找到样例或达到最大尝试次数后停止
            const foundButtons = document.querySelectorAll('.ybt-copy-btn').length;
            if (foundButtons > 0 || attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 1000);
    }

    // 根据页面状态初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听DOM变化（针对异步加载的内容）
    const observer = new MutationObserver((mutations) => {
        // 检查是否有新的pre元素或包含"样例"文本的元素出现
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 元素节点
                        if (node.tagName === 'PRE' ||
                            (node.textContent && node.textContent.includes('样例'))) {
                            shouldUpdate = true;
                            break;
                        }

                        // 检查子元素
                        if (node.querySelectorAll) {
                            const preElements = node.querySelectorAll('pre');
                            if (preElements.length > 0) shouldUpdate = true;

                            const sampleTextElements = node.querySelectorAll('font, span, div, td');
                            for (const el of sampleTextElements) {
                                if (el.textContent && el.textContent.includes('样例')) {
                                    shouldUpdate = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (shouldUpdate) {
            // 防抖：避免频繁调用
            clearTimeout(observer.timeout);
            observer.timeout = setTimeout(addCopyButtons, 300);
        }
    });

    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加一个键盘快捷键支持（可选功能）
    document.addEventListener('keydown', (e) => {
        // Alt+C 复制第一个样例
        if (e.altKey && e.key === 'c') {
            const firstCopyBtn = document.querySelector('.ybt-copy-btn');
            if (firstCopyBtn) {
                firstCopyBtn.click();
            }
        }
    });
})();