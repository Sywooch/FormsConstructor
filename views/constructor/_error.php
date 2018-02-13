<?

use yii\bootstrap\Alert;

?>

<? Alert::begin([
		'options' => ['class' => 'alert-danger'],
		'closeButton' => false, 
	]); ?>
	
	<span class="glyphicon glyphicon-exclamation-sign"></span> <?= Yii::$app->session->getFlash('error') ?>
	
<? Alert::end(); ?>