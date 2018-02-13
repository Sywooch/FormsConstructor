<?php

use yii\helpers\Url;
use yii\bootstrap\Alert;
use yii\bootstrap\Html;
use yii\bootstrap\ActiveForm;
use yii\web\View;

$this->title = $form->name;

$yiiParams = [
	'WEB_PATH' => Url::to(['/']),
	'lang' => Yii::$app->language,
	'form' => $form->toArray(),
	'formParams' => $formParams,
	'formSettings' => $formSettings,
	'formElements' => $formElements,
	'submitted' => Yii::$app->session->hasFlash('userFormSubmited')
];
$this->registerJs("
	var yiiParams = " . json_encode($yiiParams) . ";
", View::POS_HEAD);

$this->registerJsFile(
    '@web/js/jquery.stylesheet.js',
    [
		'depends' => [\yii\web\JqueryAsset::className()],
		'position' => View::POS_HEAD,
	]
);

$this->registerJsFile(
    '@web/js/fileupload/vendor/jquery.ui.widget.js',
    [
		'depends' => [\yii\web\JqueryAsset::className()],
		'position' => View::POS_HEAD,
	]
);
$this->registerJsFile(
    '@web/js/fileupload/jquery.fileupload.js',
    [
		'depends' => [\yii\web\JqueryAsset::className()],
		'position' => View::POS_HEAD,
	]
);

$this->registerCssFile('@web/css/bootstrap-datepicker3.min.css');
$this->registerJsFile(
	'@web/js/datepicker/bootstrap-datepicker.min.js',
	[
		'depends' => [\yii\web\JqueryAsset::className()],
		'position' => View::POS_HEAD,
	]
);
if (Yii::$app->language != 'en_US') {
	$this->registerJsFile(
		'@web/js/datepicker/lang/bootstrap-datepicker.' . Yii::$app->language . '.min.js',
		[
			'depends' => [\yii\web\JqueryAsset::className()],
			'position' => View::POS_HEAD,
		]
	);
}

$this->registerCssFile('@web/css/form.css');
$this->registerJsFile(
    '@web/js/form/form.js',
    ['depends' => [
		\yii\web\JqueryAsset::className(),
		\yii\widgets\ActiveFormAsset::className(),
		\yii\validators\ValidationAsset::className(),
	]]
);

?>
			
<div class="formpage use-mode">
	
	<div class="form-wrapper">
		<? $aForm = ActiveForm::begin([
			'id' => 'userForm',
			'enableClientValidation' => true,
			'errorCssClass' => 'val-error',
			'successCssClass' => 'val-success',
			'options' => [
				'class' => 'form form-pages',
			],
		]) ?>
		
		<input type="hidden" name="subUserForm" value="1" />
		
		<? ActiveForm::end() ?>
	</div>

</div>