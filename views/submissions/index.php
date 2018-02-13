<?php

use yii\web\View;
use yii\bootstrap\Html;
use yii\helpers\Url;
use yii\widgets\Pjax;
use kartik\grid\GridView;
use kartik\export\ExportMenu;

$this->title = Yii::t('site', 'Form Submissions');

$yiiParams = [
	'form' => $form->toArray(),
	'submissionsURL' => Url::to(['submissions/'], true),
	'subSetAsReadURL' => Url::to(['submissions/set-as-read']),
	'subDeleteURL' => Url::to(['submissions/delete']),
];
$this->registerJs('
	var yiiParams = ' . json_encode($yiiParams) . ';
', View::POS_HEAD);

$this->registerJsFile(
    '@web/js/submissions/form-submissions.js',
    [
		'depends' => [
			\yii\web\JqueryAsset::className(),
			\kartik\export\ExportMenuAsset::className(),
			\kartik\datetime\DateTimePickerAsset::className(),
		],
	]
);

?>

<div class="row">
	<div class="col-md-12 content-block">

		<div class="hidden" id="result"><?= Yii::$app->session->hasFlash('hasErrors') ? 'error' : 'success' ?></div>
		
		<? if (Yii::$app->session->hasFlash('error')) { ?>
			
			<?= $this->render('/constructor/_error') ?>
			
		<? } else { ?>
		
			<div class="form-submissions">
		
				<h3><?= $this->title . ' - ' . $form->name ?></h3>
			
				<div class="form-submissions-view form-horizontal" data-key="">
				</div>
			
				<div class="form-submissions-list">
				
					<?= GridView::widget([
						'id' => 'subGrid0',
						'dataProvider' => $dataProvider,
						'filterModel' => $filterModel,
						'columns' => $columns,
						'layout' => "<div class=\"form-group text-center\">{toolbar}</div>\n{items}\n{pager}",
						'formatter' => ['class' => 'yii\i18n\Formatter', 'nullDisplay' => ''],
						'condensed' => true,
						'hover' => true,
						'options' => [
							'class' => 'grid-view small',
						],
						'pjax' => true,
						'pjaxSettings' => [
							'options' => [
								'id' => 'pjaxSub',
								'enablePushState' => false,
								'clientOptions' => [
									'push' => false,
									'container' => '#pjaxSub',
								],
							],
							'loadingCssClass' => false,
							'beforeGrid' => '<div class="loader" id="loader_pjaxSub"></div>',
						],
						'export' => [
							'showConfirmAlert' => false,
							'target' => '_self',
							'header' => '<li class="dropdown-header">' . Yii::t('site', 'Export Viewed Submissions') . '</li>',
						],
						'exportConfig' => [
							GridView::HTML => [
								'icon' => 'floppy-save',
								'filename' => $form->name,
							],
							GridView::CSV => [
								'icon' => 'floppy-save',
								'filename' => $form->name,
								'config' => [
									'colDelimiter' => ';',
								],
							],
							GridView::PDF => [
								'icon' => 'floppy-save',
								'filename' => $form->name,
								'config' => [
									'methods' => [
										'SetHeader' => [
											['odd' => '', 'even' => ''],
										],
										'SetFooter' => [
											['odd' => '', 'even' => ''],
										],
									],
								],
							],
							GridView::EXCEL => [
								'icon' => 'floppy-save',
								'filename' => $form->name,
								'config' => [
									'worksheet' => $form->name,
									'cssFile' => ''
								],
							],
						],
						'toolbar' => [
							'content' => 
								'<div class="btn-group pull-left">' .
									Html::button(
										Html::icon('remove'), 
										[
											'id' => 'subDeleteAll', 
											'class' => 'btn btn-default',
											'title' => Yii::t('site', 'Delete selected submissions'),
										]
									) .
									Html::button(
										Html::icon('envelope'), 
										[
											'id' => 'subSetAllAsRead', 
											'class' => 'btn btn-default',
											'title' => Yii::t('site', 'Mark selection as read'),
										]
									) .
								'</div>' .
								'<div class="btn-group">' .
									Html::button(
										Html::icon('chevron-left'), 
										[
											'id' => 'subViewPrev', 
											'class' => 'btn btn-default',
										]
									) .
									Html::button(
										Html::icon('chevron-right'), 
										[
											'id' => 'subViewNext', 
											'class' => 'btn btn-default',
										]
									) .
								'</div>' .
								'<div class="btn-group pull-right">' .
									'{export}' .
									ExportMenu::widget([
										'id' => 'expMenu0',
										'dataProvider' => $dataProvider,
										'columns' => $columns,
										'noExportColumns' => ['checkbox', 'button_delete', 'is_new'],
										'target' => '_self',
										'showConfirmAlert' => false,
										'deleteAfterSave' => true,
										'pjaxContainerId' => 'pjaxSub',
										'clearBuffers' => true,
										'filename' => $form->name,
										'enableFormatter' => true,
										'exportConfig' => [
											ExportMenu::FORMAT_EXCEL_X => [
												'label' => 'Excel',
												'icon' => 'floppy-save',
											],
											ExportMenu::FORMAT_HTML => [
												'icon' => 'floppy-save',
											],
											ExportMenu::FORMAT_CSV => [
												'icon' => 'floppy-save',
											],
											ExportMenu::FORMAT_PDF => [
												'icon' => 'floppy-save',
											],
											ExportMenu::FORMAT_TEXT => false,
											ExportMenu::FORMAT_EXCEL => false,
										],
										'dropdownOptions' => [
											'label' => Yii::t('site', 'All'),
											'class' => 'btn btn-default',
											'itemsBefore' => [
												'<li class="dropdown-header">' . Yii::t('site', 'Export All Submissions') . '</li>',
											],
										],
										'onInitWriter' => function($writer, $grid) {
											if ($grid->getExportType() === ExportMenu::FORMAT_CSV) {
												$writer->setDelimiter(";");
												$writer->setUseBOM(true);
											}
										},
										'onRenderDataCell' => function($cell, $content, $model, $key, $index, $grid) {
											$exportType = $grid->getExportType();
											switch($exportType) {
												case ExportMenu::FORMAT_HTML:
												case ExportMenu::FORMAT_PDF:
												case ExportMenu::FORMAT_EXCEL_X:
													$cell->setValue(str_replace('<br />', "\r\n", $content));
													$cell->getStyle()->getAlignment()->setWrapText(true);
													break;
												case ExportMenu::FORMAT_CSV:
													$cell->setValue(str_replace('<br />', "\r\n", $content));
													break;
												default:
													
													break;
											}
										},
										'onGenerateFile' => function($ext, $grid) {
											if ($grid->deleteAfterSave) {
												$file = $grid::slash($grid->folder) . $grid->filename . '.' . $ext;
												@unlink($file);
											}
										},
									]) .
								'</div>',
						],
					]) ?>
				
				</div>
				
			</div>
		
		<? } ?>
		
	</div>
</div>