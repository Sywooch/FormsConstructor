<?php

use yii\web\View;
use yii\bootstrap\Html;
use yii\bootstrap\ButtonDropdown;
use yii\bootstrap\ActiveForm;
use yii\helpers\Url;
use yii\widgets\Pjax;

$yiiParams = [
	'WEB_PATH' => Url::to(['/']),
	'lang' => Yii::$app->language,
	'form' => $form->toArray(),
	'formParams' => $formParams,
	'formSettings' => $formSettings,
	'formElements' => $formElements,
	'editFormURL' => Url::to(['constructor/edit-form']),
	'uploadImageURL' => Url::to(['constructor/upload-image']),
	'imageBrowseURL' => Url::to(['constructor/image-browse']),
	'imageDeleteURL' => Url::to(['constructor/image-delete']),
];
$this->registerJs("
	var yiiParams = " . json_encode($yiiParams) . ";
", View::POS_HEAD);

$this->registerCssFile('@web/css/color-picker/color-picker.min.css');
$this->registerJsFile(
	'@web/js/color-picker.min.js',
	['position' => View::POS_HEAD]
);

$this->registerJsFile(
	'@web/js/tinymce/tinymce.min.js',
	['position' => View::POS_HEAD]
);

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
$this->registerJsFile(
    '@web/js/constructor/form-editor.js',
    ['depends' => [
		\yii\web\JqueryAsset::className(),
		\yii\widgets\ActiveFormAsset::className(),
		\yii\validators\ValidationAsset::className(),
	]]
);

?>

<div class="formpage construct-mode">
	
	<div class="form-wrapper">
		<div class="form-controls-pagelist text-center">
			<ul class="nav nav-pills btn-group"></ul>
			<?= Html::a(
				Html::icon('plus'), 
				'javascript: void(0);',
				[
					'id' => 'btnAddPageForm', 
					'class' => 'btn btn-link',
					'title' => Yii::t('forms', 'Add New Page'),
				]
			) ?>
			<?= Html::a(
				Html::icon('trash'), 
				'javascript: void(0);',
				[
					'id' => 'btnRemovePageForm', 
					'class' => 'btn btn-link hidden',
					'title' => Yii::t('forms', 'Delete Current Page'),
				]
			) ?>
		</div>
		
		<? $aForm = ActiveForm::begin([
			'id' => 'userForm',
			'enableClientValidation' => true,
			'errorCssClass' => 'val-error',
			'successCssClass' => 'val-success',
			'options' => [
				'class' => 'form form-pages tab-content',
			],
		]) ?>
		<? ActiveForm::end() ?>
	</div>
	
	<div class="form-controls-show-btn formelements-show-btn" title="<?= Yii::t('forms', 'Add Form Elements') ?>">
		<?= Html::icon('th-list') ?>
	</div>
	<div class="form-controls left-controls" id="formElements">
		
		<button type="button" class="close" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		
		<h4><?= Yii::t('forms', 'Form Elements') ?></h4>
		<div class="form-controls-page row"></div>
		
	</div>
	
	<div class="form-controls-show-btn formparams-show-btn" title="<?= Yii::t('forms', 'Form Params') ?>">
		<?= Html::icon('cog') ?>
	</div>
	<div class="form-controls right-controls" id="formParams">
		
		<button type="button" class="close" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		
		<h4><?= Yii::t('forms', 'Form Params') ?></h4>
		<div class="form-controls-page row"></div>
		
	</div>
	
	<div class="form-controls right-controls" id="elementParams">
		<button type="button" class="close" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		<h4><?= Yii::t('forms', 'Element Params') ?></h4>
		
		<div class="form-controls-page row"></div>
	</div>
	
	<div class="form-controls-show-btn formsettings-show-btn" title="<?= Yii::t('forms', 'Form Settings') ?>">
		<?= Html::icon('wrench') ?>
	</div>
	<div class="form-settings" id="formSettings">
		<button type="button" class="close" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		<div class="form-settings-wrapper row">
			<div class="form-settings-page content-block col-md-6 col-md-offset-3"></div>
		</div>
	</div>
	
	<div class="form-controls-show-btn formpublish-show-btn" title="<?= Yii::t('forms', 'Publish Form') ?>">
		<?= Html::icon('share') ?>
	</div>
	<div class="form-settings" id="formPublish">
		<button type="button" class="close" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		<div class="form-settings-wrapper row">
			<div class="form-publish-page content-block col-md-6 col-md-offset-3">
				<? Pjax::begin([
					'id' => 'settingsPjax0',
				]); ?>
				
				<?= $this->render('_publish', [
					'form' => $form,
				]) ?>
					
				<? Pjax::end(); ?>
			</div>
		</div>
	</div>
	
	<div class="form-controls-form-save btn-toolbar">
		<?= Html::a(
			Html::icon('eye-open') . ' ' . Yii::t('forms', 'Preview'),
			['form/index', 'form_id' => $form['id']],			
			[
				'id' => 'btnOpenForm', 
				'class' => 'btn btn-primary form-controls-open-form-btn',
				'target' => '_blank',
				'data-pjax' => 0,
			]
		) ?>
		<?= Html::button(
			Html::icon('floppy-disk') . ' ' . Yii::t('forms', 'Save'), 
			[
				'id' => 'btnSaveForm', 
				'class' => 'btn btn-primary form-controls-save-btn'
			]
		) ?>
	</div>

</div>