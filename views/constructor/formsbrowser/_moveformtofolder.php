<?php

use yii\helpers\Url;
use yii\web\View;
use yii\bootstrap\ActiveForm;
use yii\bootstrap\Html;
use yii\widgets\Breadcrumbs;
use yii\widgets\Pjax;
use app\models\Form;
use app\models\Folder;

?>

<div class="hidden" id="result"><?= Yii::$app->session->hasFlash('hasErrors') ? 'error' : 'success' ?></div>

<? if (Yii::$app->session->hasFlash('error')) { ?>
	
	<?= $this->render('/constructor/_error') ?>
	
<? } else if (!Yii::$app->session->hasFlash('modalFormSubmited')) { ?>

	<? Pjax::begin([
		'id' => 'modalPjax0',
		'enablePushState' => false,
	]); ?>

	<?
	$dirBreadcrumbs = [];
	$lastElement = end($dirPath);
	foreach($dirPath as $key => $value) {
		$linkText = $value ?: Yii::t('site', 'My Forms');
		$dirBreadcrumbs[] = 
			$value != $lastElement
			? [
				'label' => $linkText, 
				'url' => ['constructor/move-form-to-folder', 'id' => $form->id],
				'data' => [
					'method' => 'post',
					'params' => [
						'Folder[id]' => $key ?: null,
					],
					'pjax' => true,
				],
			]
			: $linkText;
	}
	
	echo Breadcrumbs::widget([
		'homeLink' => false,
		'encodeLabels' => true,
		'links' => $dirBreadcrumbs,
	]); 
	?>
	
	<div class="fb">
	
		<div class="loader" id="loader_modalPjax0"></div>
	
		<div class="row fb-block fb-folders">
		<? if (!empty($folders)) { ?>
		
			<? foreach($folders as $_folder) { ?>
				<div class="col-md-12">
					<?= Html::a(
						'<div class="btn-text" title="' . Html::encode($_folder->name) . '">' . Html::icon('folder-close') . Html::encode($_folder->name) . '</div>', 
						['constructor/move-form-to-folder', 'id' => $form->id], 
						[
							'class' => 'btn btn-default fb-folder fb-listed',
							'data' => [
								'method' => 'post',
								'params' => [
									'Folder[id]' => $_folder->id,
								],
								'pjax' => true,
							],
						]
					) ?>
				</div>
			<? } ?>
			
		<? } else { ?>
			
			<div class="col-md-12">
				<p class="text-muted text-center"><?=Yii::t('site', 'No subfolders') ?></p>
			</div>
			
		<? } ?>
		</div>
	</div>
	
	<? $aForm = ActiveForm::begin([
		'id' => 'modalForm',
		'enableAjaxValidation' => false,
		'enableClientValidation' => true,
		'validateOnBlur' => false,
		'validateOnType' => false,
		'validateOnChange' => false,
	]) ?>
	
	<?= Html::activeHiddenInput($folder ?? new Folder(), 'id') ?>
	
	<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal"><?= Yii::t('site', 'Cancel') ?></button>
		<?
			if (
				(!$form->folder && !$folder)
				|| ($form->folder && $folder && $form->folder->id == $folder->id)
			) {
				$disabled = true;	
			} else {
				$disabled = false;
			}
		?>
		<?= Html::submitButton(
			Html::icon('ok') . ' ' . Yii::t('site', 'Move to this Folder'), 
			[
				'name' => 'subModalForm', 
				'id' => 'subModalForm', 
				'value' => '1', 
				'class' => 'btn btn-primary' . ($disabled ? ' disabled' : ''),
				'disabled' => $disabled ? 'disabled' : null,
			]
		) ?>
	</div>
	
	<? ActiveForm::end(); ?>
	
	<? Pjax::end(); ?>

<? } ?>