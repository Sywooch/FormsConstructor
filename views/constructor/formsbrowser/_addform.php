<?php

use yii\web\View;
use yii\bootstrap\ActiveForm;
use yii\bootstrap\Html;

?>

<div class="hidden" id="result"><?= Yii::$app->session->hasFlash('hasErrors') ? 'error' : 'success' ?></div>
<div class="hidden" id="form_id"><?= $form->id ?></div>

<? if (Yii::$app->session->hasFlash('error')) { ?>
	
	<?= $this->render('/constructor/_error') ?>
	
<? } else if (!Yii::$app->session->hasFlash('modalFormSubmited')) { ?>

	<? $aForm = ActiveForm::begin([
		'id' => 'modalAddForm',
		'enableAjaxValidation' => false,
		'enableClientValidation' => true,
		'validateOnBlur' => false,
		'validateOnType' => false,
		'validateOnChange' => false,
	]) ?>
	
	<div class="form-group field-pattern-id">
		<label class="control-label"><?= Yii::t('site', 'Pattern') ?></label>
		<div class="pattern-list">
			<? foreach($patterns as $pattern) { ?>
				<?= Html::radio('Pattern[id]', $pattern->id == 1, [
					'id' => 'pattern-id-' . $pattern->id,
					'value' => $pattern->id, 
					'label' => $pattern->name . '<div class="pattern-img">' . Html::img('@web/img/patterns/' . $pattern->img) . '</div>',
					'labelOptions' => [
						'class' => 'radio-inline',
					],
					'uncheck' => null,
				]) ?>
			<? } ?>
		</div>
	</div>

	<?= $aForm->field($form, 'name', ['inputOptions' => ['autofocus' => 'autofocus']]) ?>
	
	<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal"><?= Yii::t('site', 'Cancel') ?></button>
		<?= Html::submitButton(
			Html::icon('ok') . ' ' . Yii::t('site', 'Add'), 
			['name' => 'subModalForm', 'id' => 'subModalForm', 'value' => '1', 'class' => 'btn btn-primary']
		) ?>
	</div>
	
	<? ActiveForm::end(); ?>

<? } ?>