<?php

use yii\bootstrap\Html;
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
	
	<?= $aForm->field($form, 'name', ['inputOptions' => ['autofocus' => 'autofocus']]) ?>
	
	<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal"><?= Yii::t('site', 'Cancel') ?></button>
		<?= Html::submitButton(
			Html::icon('ok') . ' ' . Yii::t('site', 'Save'), 
			['name' => 'subModalForm', 'id' => 'subModalForm', 'value' => '1', 'class' => 'btn btn-primary']
		) ?>
	</div>
	
	<? ActiveForm::end(); ?>

<? } ?>