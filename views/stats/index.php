<?php

use yii\web\View;
use yii\bootstrap\Html;
use yii\bootstrap\ActiveForm;
use yii\helpers\Url;
use yii\widgets\Pjax;
use kartik\widgets\DateTimePicker;

$this->title = Yii::t('site', 'Form Statistics');

$this->registerJsFile(
	'@web/js/flot/jquery.flot.min.js',
	[
		'depends' => [\yii\web\JqueryAsset::className()],
		'position' => View::POS_HEAD,
	]
);
$this->registerJsFile(
	'@web/js/flot/jquery.flot.time.min.js',
	[
		'depends' => [\yii\web\JqueryAsset::className()],
		'position' => View::POS_HEAD,
	]
);

$this->registerJsFile(
	'@web/js/stats/form-stats.js',
	[
		'depends' => [
			\yii\web\JqueryAsset::className(),
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
		
			<div class="form-stats">
			
				<h3><?= $this->title . ' - ' . $form->name ?></h3>
			
				<? Pjax::begin([
					'id' => 'pjaxStats',
					'enablePushState' => false,
					'clientOptions' => [
						'push' => false,
						'container' => '#pjaxStats',
					]
				]); ?>
				
					<?
						$yiiParams = [
							'form_id' => $form->id,
							'from' => $from,
							'to' => $to,
							'flotSubmissions' => $flotSubmissions,
							'flotViews' => $flotViews,
						];
						$this->registerJs('
							var yiiParams = ' . json_encode($yiiParams) . ';
						', View::POS_HEAD, 'pjaxJS');
					?>
					
					<div class="loader" id="loader_pjaxStats"></div>
			
					<? $aForm = ActiveForm::begin([
						'id' => 'statsForm',
						'enableClientValidation' => false,
						'options' => [
							'class' => 'form-inline',
							'data-pjax' => true
						],
					]) ?>
	
						<div class="form-group">
							<label for="from"><?= Yii::t('site', 'From') ?></label>
							<?= DateTimePicker::widget([
								'id' => 'from',
								'name' => 'from', 
								'options' => [],
								'type' => 1,
								'value' => $from,
								'convertFormat' => false,
								'pjaxContainerId' => 'pjaxStats',
								'pluginOptions' => [
									'autoclose' => true,
									'minuteStep' => 1,
									'minView' => 2,
									'format' => 'dd-mm-yyyy', //dd-mm-yyyy hh:ii
									'endDate' => '+0d',
									'todayHighlight' => true,
								],
							]) ?>
						</div>
						<div class="form-group">
							<label for="to"><?= Yii::t('site', 'To') ?></label>
							<?= DateTimePicker::widget([
								'id' => 'to',
								'name' => 'to', 
								'options' => [],
								'type' => 1,
								'value' => $to,
								'convertFormat' => false,
								'pjaxContainerId' => 'pjaxStats',
								'pluginOptions' => [
									'autoclose' => true,
									'minuteStep' => 1,
									'minView' => 2,
									'format' => 'dd-mm-yyyy', //dd-mm-yyyy hh:ii
									'endDate' => '+1d',
									'todayHighlight' => false,
								],
							]) ?>
						</div>
						<div class="form-group">
							<?= Html::submitButton(
								Html::icon('refresh') . ' ' . Yii::t('site', 'Update'), 
								[
									'id' => 'subStatsForm',
									'name' => 'subStatsForm',
									'value' => '1', 
									'class' => 'btn btn-default'
								]
							) ?>
						</div>
					
					<? ActiveForm::end() ?>
					
					<div class="form-statistics" id="formStatistics"></div>
				
				<? Pjax::end(); ?>
			
			</div>
		
		<? } ?>

	</div>
</div>