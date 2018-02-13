<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\helpers\Url;
use app\models\LoginForm;
use app\models\ContactForm;

class SiteController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    public function actionIndex()
    {
        Url::remember();
		return $this->render('index');
    }

    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }
	
	public function actionLanguage($lang)
    {		
		if ($lang) {
			Yii::$app->language = $lang;

			$languageCookie = new yii\web\Cookie([
				'name' => 'fc_lang',
				'value' => $lang,
				'expire' => time() + 60 * 60 * 24 * 30, // 30 days
			]);
			Yii::$app->response->cookies->add($languageCookie);
		}
        
		return $this->goBack();
    }

}
