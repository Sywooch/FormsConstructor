<?php

use yii\bootstrap\Html;
use yii\widgets\Pjax;
use yii\bootstrap\Alert;
use yii\widgets\Breadcrumbs;
use yii\web\View;
use yii\bootstrap\Modal;

$this->title = Yii::t('site', 'Forms Constructor');

?>

<? if (Yii::$app->user->isGuest) { ?>
	
	<? Alert::begin([
		'options' => ['class' => 'alert-info'],
		'closeButton' => false, 
	]); ?>
	
	<span class="glyphicon glyphicon-info-sign"></span>
	<?= Yii::t(
		'site', 
		'In order to use Forms Constructor, {0} to your account.', 
		Html::a(Yii::t('site', 'sign in'), ['/user/login'], ['class' => 'alert-link'])
	) ?>
	
	<? Alert::end(); ?>

<? } else { ?>
			
	<? Pjax::begin([
		'id' => 'fbPjax0',
	]); ?>

	<?= isset($form) 
		? $this->render('form/_form', [
			'form' => $form,
			'formParams' => $formParams,
			'formSettings' => $formSettings,
			'formElements' => $formElements,
		])
		: $this->render('formsbrowser/_formsbrowser', [
			'folder_id' => $folder_id,
			'dirPath' => $dirPath,
			'folders' => $folders,
			'forms' => $forms,
		])
	?>
	
	<? Pjax::end(); ?>
	
	<? Modal::begin([
		'header' => '<h4 class="modal-title"></h4>',
		'id' => 'modal',
		'size' => '',
		'clientOptions' => ['backdrop' => 'static', 'keyboard' => false, 'show' => false]
	]); ?>
		<div id="modalContent"></div>
	<? Modal::end(); ?>

<? } ?>