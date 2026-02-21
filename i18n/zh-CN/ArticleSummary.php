<?php
return array(
    'config' => array(
        'ai_provider' => '选择AI提供商',
        'base_url' => '基础URL (http(s)://oai.com/) 不需要\'v1\'',
        'api_key' => 'API密钥',
        'model_name' => '模型名称',
        'prompt' => '提示词 (添加到内容前)',
        'default_prompt' => '请用中文总结以下文章。保持简洁但信息丰富，突出关键点和主要思想。',
        'explain_prompt' => '讲解提示词（关键概念）',
        'default_explain_prompt' => '请讲解以下文章中的关键概念与术语，并说明它们之间的关系。请用简洁的 Markdown 项目符号列表输出（- 开头）。重点关注定义、重要术语以及它们如何相互关联。',
        'save' => '保存',
        'openai' => 'OpenAI',
        'ollama' => 'Ollama'
    ),
    'button' => array(
        'summarize' => '总结',
        'explain' => '讲解'
    ),
    'status' => array(
        'loading' => '加载中...',
        'error' => '错误',
        'request_failed' => '请求失败'
    )
);
