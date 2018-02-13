<?php

use yii\helpers\Url;
use yii\web\View;
use yii\bootstrap\ActiveForm;
use yii\bootstrap\Html;
use yii\widgets\Breadcrumbs;
use yii\widgets\Pjax;
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
				'url' => ['constructor/move-folder-to-folder', 'id' => $folder->id],
				'data' => [
					'method' => 'post',
					'params' => [
						'Folder[parent_id]' => $key ?: null, 
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
					<? if ($folder->id != $_folder->id) { ?>
						<?= Html::a(
							'<div class="btn-text" title="' . Html::encode($_folder->name) . '">' . Html::icon('folder-close') . Html::encode($_folder->name) . '</div>', 
							['constructor/move-folder-to-folder', 'id' => $folder->id], 
							[
								'class' => 'btn btn-default fb-folder fb-listed',
								'data' => [
									'method' => 'post',
									'params' => [
										'Folder[parent_id]' => $_folder->id, 
									],
									'pjax' => true,
								],
							]
						) ?>
					<? } else { ?>
						<?= Html::a(
							'<div class="btn-text" title="' . Html::encode($_folder->name) . '">' . Html::icon('folder-close') . Html::encode($_folder->name) . '</div>', 
							'javascript: void(0);', 
							[
								'class' => 'btn btn-default fb-folder fb-listed disabled',
								'disabled' => 'disabled',
							]
						) ?>
					<? } ?>
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

	<?= Html::activeHiddenInput($parentFolder ?? new Folder(), 'parent_id', ['value' => $parentFolder ? $parentFolder->id : null]) ?>
	
	<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal"><?= Yii::t('site', 'Cancel') ?></button>
		<?
			if (
				(!$parentFolder && !$folder->parent_id)
				|| ($parentFolder && $parentFolder->id == $folder->parent_id)
				|| ($parentFolder && $parentFolder->id == $folder->id)
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