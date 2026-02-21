<?php
return array(
    'config' => array(
        'ai_provider' => 'Choose AI Provider',
        'base_url' => 'Base URL (http(s)://oai.com/) without \'v1\'',
        'api_key' => 'API Key',
        'model_name' => 'Model Name',
        'prompt' => 'Prompt (add before content)',
        'default_prompt' => 'Please summarize the following article in English. Keep it concise but informative, highlighting the key points and main ideas.',
        'explain_prompt' => 'Explain prompt (key concepts)',
        'default_explain_prompt' => 'Explain the key concepts in the following article. Output as a concise Markdown bullet list. Focus on definitions, important terms, and how they relate to each other.',
        'save' => 'Save',
        'openai' => 'OpenAI',
        'ollama' => 'Ollama'
    ),
    'button' => array(
        'summarize' => 'Summarize',
        'explain' => 'Explain'
    ),
    'status' => array(
        'loading' => 'Loading...',
        'error' => 'Error',
        'request_failed' => 'Request Failed'
    )
);
