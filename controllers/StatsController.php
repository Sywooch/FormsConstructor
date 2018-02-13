<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\helpers\Url;
use yii\helpers\ArrayHelper;
use yii\bootstrap\Html;
use app\models\Form;
use app\models\FormSubmission;
use app\models\FormView;

class StatsController extends Controller
{
	public function actionIndex($id)
	{
		$request = Yii::$app->request;
		
		$form = Form::find()
			->with('formSubmissions')
			->with('formViews')
			->where([
				'form.id' => $id, 
				'form.user_id' => Yii::$app->user->id,
			])
			->one();
		
		if (!$form) {
			
			$this->goneBadError();
			
		} else {
			
			if (empty($request->post('from'))) {
				$from = (new \DateTime())->sub( new \DateInterval("P7D") )->setTime(0, 0, 0);
			} else {
				$from = \DateTime::createFromFormat('d-m-Y', $request->post('from'));
			}
			if (empty($request->post('to'))) {
				$to = new \DateTime('tomorrow');
			} else {
				$to = \DateTime::createFromFormat('d-m-Y', $request->post('to'));
			}
			
			$period = new \DatePeriod($from, new \DateInterval('P1D'), $to);
			
			$submissions = FormSubmission::find()
				->where([
					'form_id' => $form->id,
				])
				->andWhere([
					'between', 
					'sub_date', 
					$from->format('Y-m-d H:i'), 
					$to->format('Y-m-d H:i'), 
				])
				->all();
			
			$countSubmissions = [];
			foreach($period as $dt) {
				$countSubmissions[$dt->format('d-m-Y')] = 0;
			}
			
			foreach($submissions as $sumbission) {
				$date = date_create($sumbission->sub_date)->format('d-m-Y');
				$countSubmissions[$date] += 1;
			}
			
			$flotSubmissions = [];
			foreach($countSubmissions as $flotDate => $flotCount) {
				$flotSubmissions[] = [
					\DateTime::createFromFormat('!d-m-Y', $flotDate)->getTimestamp() * 1000,
					$flotCount,
				];
			}
			
			$views = FormView::find()
				->where([
					'form_id' => $form->id,
				])
				->andWhere([
					'between', 
					'view_date', 
					$from->format('Y-m-d H:i'), 
					$to->format('Y-m-d H:i'), 
				])
				->all();
			
			$countViews = [];
			foreach($period as $dt) {
				$countViews[$dt->format('d-m-Y')] = 0;
			}
			
			foreach($views as $view) {
				$date = date_create($view->view_date)->format('d-m-Y');
				$countViews[$date] += 1;
			}
			
			$flotViews = [];
			foreach($countViews as $flotDate => $flotCount) {
				$flotViews[] = [
					\DateTime::createFromFormat('!d-m-Y', $flotDate)->getTimestamp() * 1000,
					$flotCount,
				];
			}
			
		}
		
		return $this->render('index', [
			'form' => $form,
			'flotSubmissions' => $flotSubmissions,
			'flotViews' => $flotViews,
			'from' => $from->format('d-m-Y'),
			'to' => $to->format('d-m-Y'),
		]);
	}
	
	private function goneBadError() {
		$msg = Yii::t('site', 'Sorry, could not complete the operation. Parameter values are not valid.');
		Yii::$app->session->setFlash('error', $msg);
		Yii::$app->session->setFlash('hasErrors', true);
		
		return $msg;
	}
	
}
