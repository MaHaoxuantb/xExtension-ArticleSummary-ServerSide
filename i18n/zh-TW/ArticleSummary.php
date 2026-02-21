<?php
return array(
    'config' => array(
        'ai_provider' => '選擇AI提供商',
        'base_url' => '基礎URL (http(s)://oai.com/) 不需要\'v1\'',
        'api_key' => 'API密鑰',
        'model_name' => '模型名稱',
        'prompt' => '提示詞 (添加到內容前)',
        'default_prompt' => '請用中文繁體總結以下文章。保持簡潔但資訊豐富，突出關鍵點和主要思想。',
        'explain_prompt' => '講解提示詞（關鍵概念）',
        'default_explain_prompt' => '請講解以下文章中的關鍵概念與術語，並說明它們之間的關係。請用簡潔的 Markdown 專案符號清單輸出（- 開頭）。重點關注定義、重要術語以及它們如何相互關聯。',
        'save' => '儲存',
        'openai' => 'OpenAI',
        'ollama' => 'Ollama'
    ),
    'button' => array(
        'summarize' => '總結',
        'explain' => '講解'
    ),
    'status' => array(
        'loading' => '載入中...',
        'error' => '錯誤',
        'request_failed' => '請求失敗'
    )
);
