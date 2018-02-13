<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\bootstrap\Html;
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

<div class="wrap form-wrap">

    <div class="container fullwidth">

		<?= $content ?>
		
    </div>
</div>

<div class="footer text-center">
	<div class="container">
        <div class="copy-info center-block"><a href="<?= Yii::$app->homeUrl ?>" target="_blank">&copy; FormsConstructor <?= date('Y') ?></a></div>
    </div>
</div>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
