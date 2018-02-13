<?php

use yii\bootstrap\Html;
use yii\helpers\Url;
use yii\web\View;
use yii\bootstrap\ActiveForm;

?>

<div class="hidden" id="result"><?= Yii::$app->session->hasFlash('hasErrors') ? 'error' : 'success' ?></div>

<? if (Yii::$app->session->hasFlash('error')) { ?>
	
	<?= $this->render('/constructor/_error') ?>
	
<? } else if (!Yii::$app->session->hasFlash('modalFormSubmited')) { ?>

	<? $aForm = ActiveForm::begin([
		'id' => 'modalForm',
		'enableAjaxValidation' => false,
		'enableClientValidation' => true,
		'validateOnBlur' => false,
		'validateOnType' => false,
		'validateOnChange' => false,
	]) ?>
	
	<p><?= Yii::t('site', 'Are you sure you want to delete folder \'{0}\'?', '<span class="strong">' . $folder->name . '</span>') ?></p>
	<p>
		<span class="glyphicon glyphicon-info-sign"></span>
		<?= Yii::t(
			'site', 
			'All the included folders will be also deleted, but contained forms will be moved in the current \'{0}\' folder.', 
			'<span class="strong">' . ($parentFolder ? $parentFolder->name : Yii::t('site', 'My Forms')) . '</span>'
		) ?>
	</p>
	
	<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal"><?= Yii::t('site', 'Cancel') ?></button>
		<?= Html::submitButton(
			Html::icon('ok') . ' ' . Yii::t('site', 'Delete'), 
			['name' => 'subModalForm', 'id' => 'subModalForm', 'value' => '1', 'class' => 'btn btn-danger']
		) ?>
	</div>
	
	<? ActiveForm::end(); ?>

<? } ?>