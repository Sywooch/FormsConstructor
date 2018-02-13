<?php

namespace app\components;

use yii\base\BootstrapInterface;

class LanguageSelector implements BootstrapInterface
{
    public $supportedLanguages = [];

    public function bootstrap($app)
    {
        $preferredLanguage = isset($app->request->cookies['fc_lang']) ? (string)$app->request->cookies['fc_lang'] : null;
		if (empty($preferredLanguage)) {
            $preferredLanguage = $app->request->getPreferredLanguage(array_keys($this->supportedLanguages));
        }
		
		$app->language = $preferredLanguage;
		
		$app->params['supportedLanguages'] = $this->supportedLanguages;
    }
}