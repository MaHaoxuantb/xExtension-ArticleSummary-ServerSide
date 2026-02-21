/**
 * Article Summary Extension - Frontend JavaScript
 * Article Summary Extension - 前端JavaScript
 */

// Initialize summarize buttons when DOM is loaded
// 当DOM加载完成时初始化总结按钮
if (document.readyState && document.readyState !== 'loading') {
  configureSummarizeButtons();
} else {
  document.addEventListener('DOMContentLoaded', configureSummarizeButtons, false);
}

/**
 * Configure event listeners for summarize buttons
 * 为总结按钮配置事件监听器
 */
function configureSummarizeButtons() {
  // Ensure button labels are visible even before clicking the article header
  // 确保按钮在点击文章标题之前也能显示文本
  var summarizeBtns = document.querySelectorAll('.oai-summary-btn');
  for (var i = 0; i < summarizeBtns.length; i++) {
    var summarizeBtn = summarizeBtns[i];
    if (!summarizeBtn.innerHTML) {
      summarizeBtn.innerHTML = summarizeBtn.dataset.summarizeText || '';
    }
  }
  var explainBtns = document.querySelectorAll('.oai-explain-btn');
  for (var j = 0; j < explainBtns.length; j++) {
    var explainBtn = explainBtns[j];
    if (!explainBtn.innerHTML) {
      explainBtn.innerHTML = explainBtn.dataset.explainText || '';
    }
  }

  document.getElementById('global').addEventListener('click', function (e) {
    for (var target = e.target; target && target != this; target = target.parentNode) {
      
      // Handle article header click to add text to summary button
      // 处理文章标题点击，为总结按钮添加文本
      if (target.matches('.flux_header')) {
        const container = target.nextElementSibling;
        if (container) {
          const summarizeBtn = container.querySelector('.oai-summary-btn');
          const explainBtn = container.querySelector('.oai-explain-btn');
          if (summarizeBtn) {
            summarizeBtn.innerHTML = summarizeBtn.dataset.summarizeText;
          }
          if (explainBtn) {
            explainBtn.innerHTML = explainBtn.dataset.explainText;
          }
        }
      }

      // Handle action button click (summarize/explain)
      // 处理动作按钮点击（总结/讲解）
      if (target.matches('.oai-summary-btn') || target.matches('.oai-explain-btn')) {
        e.preventDefault();
        e.stopPropagation();
        if (target.dataset.request) {
          oaiActionButtonClick(target);
        }
        break;
      }
    }
  }, false);
}

/**
 * Set the state of the AI summary component
 * 设置AI总结组件的状态
 * 
 * @param {HTMLElement} container - The summary container element
 * @param {number} statusType - Status type: 1=loading, 2=error, 0=success
 * @param {string} statusMsg - Status message to display
 * @param {string} summaryText - Summary text to display when completed
 */
function setOaiState(container, statusType, statusMsg, summaryText) {
  const buttons = container.querySelectorAll('.oai-action-btn');
  const content = container.querySelector('.oai-summary-content');
  
  // Set different states based on statusType
  // 根据statusType设置不同状态
  if (statusType === 1) {
    // Loading state
    // 加载状态
    container.classList.add('oai-loading');
    container.classList.remove('oai-error');
    content.innerHTML = statusMsg;
    for (var b1 = 0; b1 < buttons.length; b1++) {
      buttons[b1].disabled = true;
    }
  } else if (statusType === 2) {
    // Error state
    // 错误状态
    container.classList.remove('oai-loading');
    container.classList.add('oai-error');
    content.innerHTML = statusMsg;
    for (var b2 = 0; b2 < buttons.length; b2++) {
      buttons[b2].disabled = false;
      buttons[b2].classList.remove('oai-active');
    }
  } else {
    // Success state
    // 成功状态
    container.classList.remove('oai-loading');
    container.classList.remove('oai-error');
    if (statusMsg === 'finish'){
      for (var b3 = 0; b3 < buttons.length; b3++) {
        buttons[b3].disabled = false;
        buttons[b3].classList.remove('oai-active');
      }
    }
  }

  // Update content with summary text if provided
  // 如果提供了总结文本，则更新内容
  if (summaryText) {
    content.innerHTML = summaryText;
  }
}

/**
 * Handle summarize/explain action button click event
 * 处理总结/讲解按钮点击事件
 *
 * @param {HTMLElement} target - The clicked button element
 */
async function oaiActionButtonClick(target) {
  var container = target.parentNode;
  // In current markup, buttons are inside .oai-summary-actions
  // If that changes, fall back to closest wrapper
  if (container && !container.classList.contains('oai-summary-wrap')) {
    container = target.closest('.oai-summary-wrap') || target.parentNode;
  }

  if (!container) {
    return;
  }

  // Prevent multiple requests while loading
  // 加载时防止多次请求
  if (container.classList.contains('oai-loading')) {
    return;
  }

  // Mark active button for spinner
  // 标记当前激活按钮用于显示加载动画
  var allBtns = container.querySelectorAll('.oai-action-btn');
  for (var k = 0; k < allBtns.length; k++) {
    allBtns[k].classList.remove('oai-active');
  }
  target.classList.add('oai-active');

  const loadingText = target.dataset.loadingText;
  setOaiState(container, 1, loadingText, null);

  var url = target.dataset.request;
  var data = {
    ajax: true,
    _csrf: context.csrf
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(data)
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await response.json();
      if (json.response && json.response.error) {
        let errorData = json.response.data || json.response.error;
        if (typeof errorData === 'object') {
          errorData = JSON.stringify(errorData);
        }
        throw new Error(errorData);
      }
      if (!response.ok) {
        throw new Error(target.dataset.requestFailedText);
      }
      setOaiState(container, 0, 'finish', null);
      return;
    }

    if (!response.ok) {
      throw new Error(target.dataset.requestFailedText);
    }

    const provider = response.headers.get('X-AI-Provider');

    if (provider === 'openai') {
      await handleOpenAIStream(container, response);
    } else {
      await handleOllamaStream(container, response);
    }
  } catch (error) {
    console.error(error);
    const errorMsg = error.message || 'Request Failed';
    setOaiState(container, 2, errorMsg, null);
  }
}

/**
 * Handle OpenAI stream response
 * 处理OpenAI流式响应
 * 
 * @param {HTMLElement} container - The summary container element
 * @param {Response} response - The fetch response object
 */
async function handleOpenAIStream(container, response) {
  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let text = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setOaiState(container, 0, 'finish', null);
        break;
      }
      
      buffer += decoder.decode(value, { stream: true });
      
      let endIndex;
      while ((endIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, endIndex).trim();
        buffer = buffer.slice(endIndex + 1);
        
        if (!line) continue;
        
        if (line === 'data: [DONE]') { // Standard OpenAI DONE signal
          break;
        }
        
        if (line.startsWith('data: ')) {
          const jsonString = line.slice(6).trim();
          if (jsonString === '[DONE]') break; // Sometimes it comes without data: prefix
          
          try {
            const json = JSON.parse(jsonString);
            if (json.choices && json.choices[0].delta) {
              const delta = json.choices[0].delta;
              if (delta.content) {
                text += delta.content;
                setOaiState(container, 0, null, marked.parse(text));
              }
            }
          } catch (e) {
            console.error('Error parsing OpenAI response:', e, 'Line:', jsonString);
          }
        }
      }
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Handle Ollama stream response
 * 处理Ollama流式响应
 * 
 * @param {HTMLElement} container - The summary container element
 * @param {Response} response - The fetch response
 */
async function handleOllamaStream(container, response){
  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let text = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setOaiState(container, 0, 'finish', null);
        break;
      }
      
      buffer += decoder.decode(value, { stream: true });
      
      let endIndex;
      while ((endIndex = buffer.indexOf('\n')) !== -1) {
        const jsonString = buffer.slice(0, endIndex).trim();
        buffer = buffer.slice(endIndex + 1);

        try {
          if (jsonString) {
            const json = JSON.parse(jsonString);
            if (json.response) {
                text += json.response;
                setOaiState(container, 0, null, marked.parse(text));
            }
            
            if (json.done) {
                // Done signal from Ollama
            }
          }
        } catch (e) {
          console.error('Error parsing JSON:', e, 'Chunk:', jsonString);
        }
      }
    }
  } catch (error) {
    throw error;
  }
}
