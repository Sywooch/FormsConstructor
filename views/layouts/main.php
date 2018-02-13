<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\bootstrap\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;
use yii\helpers\Url;

AppAsset::register($this);

require(Url::to('@app/messages/site-js.php'));
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= $this->registerLinkTag(['rel' => 'icon', 'type' => 'image/png', 'href' => Url::to(['/favicon.ico'])]) ?>
	<?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>

<div class="wrap <?= in_array($this->context->id, ['constructor', 'submissions', 'stats']) ? 'constructor-wrap' : '' ?>">
    
	<?
    NavBar::begin([
        'brandLabel' => Yii::$app->name,
        'brandUrl' => Yii::$app->homeUrl,
        'options' => [
            'class' => 'navbar-inverse navbar-fixed-top',
        ],
    ]);

	$navItems = [
		['label' => Yii::t('site', 'Home'), 'url' => ['/site/index']],
		[
			'label' => Yii::t('site', 'Constructor'), 
			'url' => ['/constructor/index'],
			'active' => in_array($this->context->id, ['constructor', 'submissions', 'stats']),
		],
	];
	
	if (!Yii::$app->user->isGuest && Yii::$app->user->identity->isAdmin) {
		$navItems[] = ['label' => Yii::t('user', 'Users'), 'url' => ['/user/admin/index']];
	}
	
	$languages = Yii::$app->params['supportedLanguages'];
	$langs = [];
	foreach($languages as $lang => $label) {
		$langs[] = [
			'label' => Html::img('@web/img/lang/' . $lang . '.png') . $label, 
			'url' => ['/site/language', 'lang' => $lang]
		];
	}
	$navItems[] = [
		'label' => Html::img('@web/img/lang/' . Yii::$app->language . '.png'),
		'items' => $langs,
	];
	
	if (Yii::$app->user->isGuest) {
		$navItems[] = ['label' => Yii::t('user', 'Sign in'), 'url' => ['/user/login']];
	} else {
		$navItems[] = [
			'label' => Yii::$app->user->identity->username,
			'items' => [
				['label' => Html::icon('user') . Yii::t('user', 'Account'), 'url' => ['/user/settings/account']],
				'<li class="divider"></li>',
				['label' => Html::icon('log-out') . Yii::t('user', 'Sign out'), 'url' => ['/site/logout'], 'linkOptions' => ['data-method' => 'post']],
			],
		];
	}
	
	echo Nav::widget([
		'options' => ['class' => 'navbar-nav navbar-right'],
		'items' => $navItems,
		'encodeLabels' => false,
	]);
	
    NavBar::end();
    ?>

    <div class="container <?= isset($this->params['fullwidth']) && $this->params['fullwidth'] == true ? 'fullwidth' : '' ?>">
        
		<?= Breadcrumbs::widget([
            'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
        ]) ?>

		<?= $content ?>
		
    </div>
</div>

<div class="footer text-center">
	<div class="container">
        <div class="copy-info center-block">&copy; FormsConstructor <?= date('Y') ?></div>
    </div>
</div>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
