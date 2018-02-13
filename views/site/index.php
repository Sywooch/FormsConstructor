<?php

use yii\helpers\Url;
use yii\bootstrap\Html;
use yii\web\View;

/* @var $this yii\web\View */

$this->title = Yii::$app->name;
?>

<div class="site-index">

	<div class="jumbotron">
		<p><?=Yii::t(
			'site', 
			'{0} - это визуальный онлайн конструктор форм для интеграции с внешними сайтами. Обладает широким набором элементов для размещения, вариантами их кастомизации и дополнительными возможностями, например, просмотром статистики по заполненным клиентами формам.', 
			Html::a('FormsConstructor', Yii::$app->homeUrl)
		) ?></p>
		<p><?= Html::a(
			Yii::t('site', 'Try it!'),
			Url::to(['/constructor']),
			['class' => 'btn btn-success pull-right']
		) ?></p>
	</div>

</div>
