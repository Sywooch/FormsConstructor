<?php

use yii\widgets\Breadcrumbs;
use yii\web\View;
use yii\bootstrap\Html;
use yii\bootstrap\ButtonDropdown;
use yii\helpers\Url;

$yiiParams = [
	'formUrl' => Url::to(['constructor/form']),
	'addFolderURL' => Url::to(['constructor/add-folder', 'folder_id' => $folder_id ?? '']),
	'addFormURL' => Url::to(['constructor/add-form', 'folder_id' => $folder_id ?? '']),
	'editFolderURL' => Url::to(['constructor/edit-folder']),
	'editFormURL' => Url::to(['constructor/edit-form']),
	'deleteFolderURL' => Url::to(['constructor/delete-folder']),
	'deleteFormURL' => Url::to(['constructor/delete-form']),
	'moveFolderToFolderURL' => Url::to(['constructor/move-folder-to-folder']),
	'moveFormToFolderURL' => Url::to(['constructor/move-form-to-folder']),
	'publishFormURL' => Url::to(['constructor/publish-form']),
	'subGetNewSubmissionsCount' => Url::to(['submissions/get-new-submissions-count']),
	'turnFormOnOffURL' => Url::to(['constructor/turn-form-on-off']),
	'folder_id' => $folder_id,
];
$this->registerJs('
	var yiiParams = ' . json_encode($yiiParams) . ';
', View::POS_HEAD);

$this->registerJsFile(
    '@web/js/constructor/forms-browser.js',
    [
		'depends' => [\yii\web\JqueryAsset::className()]
	]
);

?>

<div class="row">
	<div class="col-md-12 content-block">

		<? 
		$dirBreadcrumbs = [];
		$lastElement = end($dirPath);
		foreach($dirPath as $key => $value) {
			$linkText = $value ?: Yii::t('site', 'My Forms');
			$dirBreadcrumbs[] = 
				$value != $lastElement
				? [
					'label' => $linkText, 
					'url' => ['constructor/index', 'folder_id' => ($key ?: null)],
					'template' => '<li class="droppable">{link}</li>',
					'class' => 'btn fb-folder',
					'data-folder_id' => $key,
				]
				: $linkText;
		}
		
		echo Breadcrumbs::widget([
			'homeLink' => false,
			'encodeLabels' => true,
			'activeItemTemplate' => '<li class="active"><a class="btn disabled" href="javascript: void(0);">{link}</a></li>',
			'links' => $dirBreadcrumbs,
		]);
		?>
		
		<div class="fb">
		
			<div class="loader" id="loader_fbPjax0"></div>
		
			<div class="fb-block fb-controls">
				<?= ButtonDropdown::widget([
					'encodeLabel' => false,
					'label' => Html::icon('plus'),
					'dropdown' => [
						'items' => [
							[
								'label' => Html::icon('folder-close') . Yii::t('site', 'New Folder'), 
								'url' => 'javascript: void(0);', 
								'linkOptions' => ['id' => 'showAddFolder']
							],
							[
								'label' => Html::icon('file') . Yii::t('site', 'New Form'), 
								'url' => 'javascript: void(0);',
								'linkOptions' => ['id' => 'showAddForm']
							],
						],
						'encodeLabels' => false,
					],
					'options' => [
						'aria-label' => 'Add'
					]
				]); ?>
			</div>
			
			<? if (!empty($folders) || !empty($forms)) { ?>
			
				<div class="row fb-block fb-folders">		
					<? foreach($folders as $folder) { ?>
						<div class="col-md-3 draggable">
							<div class="btn-group btn-block droppable">
								<?= Html::a(
									'<div class="btn-text" title="' . Html::encode($folder->name) . '">' . Html::icon('folder-close') . Html::encode($folder->name) . '</div>', 
									['constructor/index', 'folder_id' => $folder->id], 
									[
										'class' => 'btn btn-default btn-lg fb-folder',
										'data-folder_id' => $folder->id,
									]
								) ?>
								<?= ButtonDropdown::widget([
									'label' => '',
									'dropdown' => [
										'items' => [
											[
												'label' => Html::icon('pencil') . Yii::t('site', 'Rename'), 
												'url' => 'javascript: void(0);',
												'linkOptions' => [
													'class' => 'showRenameFolder',
													'data-folder_id' => $folder->id,
												]
											],
											[
												'label' => Html::icon('folder-open') . Yii::t('site', 'Move to...'), 
												'url' => 'javascript: void(0);',
												'linkOptions' => [
													'class' => 'showMoveFolderToFolder',
													'data-folder_id' => $folder->id,
												]
											],
											[
												'label' => Html::icon('trash') . Yii::t('site', 'Delete'), 
												'url' => 'javascript: void(0);',
												'linkOptions' => [
													'class' => 'showDeleteFolder',
													'data-folder_id' => $folder->id,
												]
											],
										],
										'encodeLabels' => false,
									],
									'options' => [
										'class' => 'btn btn-default btn-lg btn-block'
									],
									'containerOptions' => [
										'class' => 'fb-folder-dropdown',
									]
								]) ?>
							</div>
						</div>
					<? } ?>
				</div>
			
				<div class="row fb-block fb-forms">	
					<? foreach($forms as $form) { ?>
						<? 
							$isActive = $form->getFormSetting('form_active'); 
							$newSubmissions = $form->getNewFormSubmissionsCount();
						?>
						<div class="col-md-3 draggable">
							<div class="btn-group btn-block">
								<?= Html::a(
									Html::icon('list-alt', [ 'tag' => 'div']) 
									. '<div class="btn-text" title="' . Html::encode($form->name) . '">' . Html::encode($form->name) . '</div>' 
									. '<span class="badge">' . ($newSubmissions ? $newSubmissions : '') . '</span>', 
									['constructor/index', 'form_id' => $form->id], 
									[
										'class' => 'btn btn-default btn-lg fb-form' . ($isActive ? '' : ' fb-form-disabled'),
										'data-form_id' => $form->id,
										'data-pjax' => '0',
									]
								); ?>
								<?= ButtonDropdown::widget([
									'label' => '',
									'dropdown' => [
										'items' => [
											[
												'label' => Html::icon('eye-open') . Yii::t('site', 'View'), 
												'url' => ['form/index', 'form_id' => $form->id],
												'linkOptions' => [
													'target' => '_blank',
													'data-pjax' => 0,
												]
											],
											[
												'label' => Html::icon('share') . Yii::t('site', 'Publish'), 
												'url' => 'javascript: void(0);',
												'linkOptions' => [
													'class' => 'showPublishForm',
													'data-form_id' => $form->id,
												]
											],
											'<li role="presentation" class="divider"></li>',
											[
												'label' => 
													Html::icon('list-alt') . Yii::t('site', 'Submissions') . ' '
													. '<span class="badge">' . ($newSubmissions ? $newSubmissions : '') . '</span>', 
												'url' => ['submissions/index', 'id' => $form->id],
												'linkOptions' => [
													'data-pjax' => '0',
												]
											],
											[
												'label' => Html::icon('signal') . Yii::t('site', 'Statistics'), 
												'url' => ['stats/index', 'id' => $form->id],
												'linkOptions' => [
													'data-pjax' => '0',
												]
											],
											'<li role="presentation" class="divider"></li>',
											[
												'label' => Html::icon('cog') . Yii::t('site', 'Edit'), 
												'url' => ['constructor/index', 'form_id' => $form->id],
												'linkOptions' => [
													'data-pjax' => '0',
												]
											],
											[
												'label' => ($isActive ? Html::icon('stop') . Yii::t('forms', 'Off') : Html::icon('play') . Yii::t('forms', 'On')), 
												'url' => 'javascript: void(0);',
												'linkOptions' => [
													'class' => ($isActive ? 'cmdTurnOffForm' : 'cmdTurnOnForm'),
													'data-form_id' => $form->id,
												]
											],
											'<li role="presentation" class="divider"></li>',
											[
												'label' => Html::icon('pencil') . Yii::t('site', 'Rename'), 
												'url' => 'javascript: void(0);',
												'linkOptions' => [
													'class' => 'showRenameForm',
													'data-form_id' => $form->id,
												]
											],
											[
												'label' => Html::icon('folder-open') . Yii::t('site', 'Move to...'), 
												'url' => 'javascript: void(0);',
												'linkOptions' => [
													'class' => 'showMoveFormToFolder',
													'data-form_id' => $form->id,
												]
											],
											[
												'label' => Html::icon('trash') . Yii::t('site', 'Delete'), 
												'url' => 'javascript: void(0);',
												'linkOptions' => [
													'class' => 'showDeleteForm',
													'data-form_id' => $form->id,
												]
											],
										],
										'encodeLabels' => false,
									],
									'options' => [
										'class' => 'btn btn-default btn-lg btn-block'
									],
									'containerOptions' => [
										'class' => 'fb-form-dropdown',
									]
								]) ?>
							</div>
						</div>
					<? } ?>
				</div>
				
			<? } else { ?>
				
				<div class="row fb-block fb-forms">	
					<div class="col-md-12">
						<p class="text-muted text-center"><?=Yii::t('site', 'Empty folder') ?></p>
					</div>
				</div>
			
			<? } ?>
			
		</div>

	</div>
</div>