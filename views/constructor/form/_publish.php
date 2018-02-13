<?php

use yii\web\View;
use yii\bootstrap\Html;
use yii\helpers\Url;

$this->registerJsFile(
    '@web/js/constructor/form-publish.js',
    [
		'depends' => [\yii\web\JqueryAsset::className()]
	]
);

$directLink = Url::to(['form/index', 'form_id' => $form->id], true);

$formHeight = $form->getFormSetting('form_height');
$iframe = 
	'<iframe'
	. ' id="fcFrame_' . $form->id . '"'
	. ' onload="window.parent.scrollTo(0,0)" allowtransparency="true"'
	. ' src="' . $directLink . '"'
	. ' frameborder="0"'
	. ' style="width: 100%; height: ' . ($formHeight + 50) . 'px; border: none;"'
	. ' scrolling="no"'
	. '></iframe>';

?>
<div class="form-publish">

	<div class="hidden" id="result"><?= Yii::$app->session->hasFlash('hasErrors') ? 'error' : 'success' ?></div>

	<? if (Yii::$app->session->hasFlash('error')) { ?>
		
		<?= $this->render('/constructor/_error') ?>
		
	<? } else { ?>
	
		<div class="panel panel-default">
			<div class="form-group panel-body form-publish-group form-publish-direct">
				<label class="control-label"><?= Yii::t('forms', 'Direct Link') ?></label>
				<div class="input-group">
					<span class="input-group-addon"><span class="glyphicon glyphicon-link"></span></span>
					<input type="text" class="form-control form-publish-content" name="form_publish_direct" id="form_publish_direct" value="<?= $directLink ?>" readonly="readonly" />
				</div>
				<div class="help-block small"><?= Yii::t('forms', 'Direct link by which your form can be opened') ?></div>
				<button type="button" class="btn btn-primary pull-right btn-copy-content"><?= Yii::t('forms', 'Copy') ?></button>
			</div>
		</div>
		
		<div class="panel panel-default">
			<div class="form-group panel-body form-publish-group form-publish-iframe">
				<label class="control-label">iFrame</label>
				<?= Html::textarea('form_publish_iframe', $iframe, [
					'class' => 'form-control form-publish-content',
					'id' => 'form_publish_iframe',
					'style' => 'height: 200px; resize: none;',
					'readonly' => true,
				]) ?>
				<div class="help-block small"></div>
				<button type="button" class="btn btn-primary pull-right btn-copy-content"><?= Yii::t('forms', 'Copy') ?></button>
			</div>
		</div>
	
	<? } ?>
	
</div>