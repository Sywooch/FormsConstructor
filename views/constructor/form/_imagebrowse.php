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
	
<? } else { ?>
	
	<? if (!empty($images)) { ?>
	
		<? foreach($images as $image) { ?>
			<? $imagePath = 'uploads/' . $form->user_id . '/' . $form->id . '/' . $image->name; ?>
			<a class="image-link col-md-3" href="javascript: void(0);" data-file-id="<?= $image->id ?>" data-file-src="<?= $imagePath ?>">
				<img src="<?= Url::to('@web/' . $imagePath) ?>" />
			</a>
		<? } ?>
		
	<? } else { ?>
		
		<div class="col-md-12">
			<p class="text-muted text-center"><?= Yii::t('forms', 'No images') ?></p>
		</div>
		
	<? } ?>

<? } ?>