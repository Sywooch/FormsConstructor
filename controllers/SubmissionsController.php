<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\helpers\Url;
use yii\helpers\ArrayHelper;
use yii\bootstrap\Html;
use yii\data\ArrayDataProvider;
use app\models\Form;
use app\models\FormElement;
use app\models\Param;
use app\models\FormSubmission;
use kartik\widgets\DateTimePicker;

class SubmissionsController extends Controller
{
	public function actionIndex($id)
	{
		$request = Yii::$app->request;
		
		$form = Form::find()
			->with('formSubmissions')
			->where([
				'form.id' => $id, 
				'form.user_id' => Yii::$app->user->id,
			])
			->one();
		
		$submissions = [];
		$columns = [];
		$filterModel = [];
		
		if (!$form) {
			
			$this->goneBadError();
			
		} else {

			foreach($form->formSubmissions as $formSumbission) {
				
				$filterModel['sub_date'] = $request->get('Submission')['sub_date'];
				
				$submission = [
					'id' => $formSumbission->id,
					'is_new' => $formSumbission->is_new,
					'sub_date' => Yii::$app->formatter->asDatetime(date_create($formSumbission->sub_date), 'dd-MM-yyyy HH:mm:ss'),
				];
				$_columns = [
					'checkbox' => [
						'class' => 'kartik\grid\CheckboxColumn',
						'name' => 'cbFormSubmission',
					],
					'button_delete' => [
						'class' => 'kartik\grid\ActionColumn',
						'template' => '{delete}',
						'header' => '',
						'hiddenFromExport' => true,
						'buttons' => [
							'delete' => function ($url, $model, $key) {
								return Html::a(
									'<span class="glyphicon glyphicon-remove"></span>', 
									'javascript: void(0);', 
									[
										'class' => 'btn btn-link subDelete',
										'title' => Yii::t('site', 'Delete submission'),
										'data-sub_id' => $key,
									]
								);
							},
						],
					],
					'is_new' => [
						'attribute' => 'is_new',
						'label' => Yii::t('site', 'Read'),
						'mergeHeader' => true,
						'format' => 'raw',
						'hiddenFromExport' => true,
						'value' => function($model, $key, $index, $column) {
							return Html::a(
								'<span class="glyphicon glyphicon-envelope"></span>', 
								'javascript: void(0);', 
								[
									'class' => 'btn btn-link subSetAsRead' . ($model['is_new'] ? ' submission-new' : ''),
									'title' => Yii::t('site', 'Set as read'),
									'data-sub_id' => $key,
								]
							);
						},
					],
					'sub_date' => [
						'attribute' => 'sub_date',
						'label' => Yii::t('site', 'Date Submitted'),
						'filter' => DateTimePicker::widget([
							'id' => 'dt_sub_date',
							'name' => 'Submission[sub_date]', 
							'options' => [],
							'type' => 1,
							'value' => $filterModel['sub_date'],
							'convertFormat' => false,
							'pjaxContainerId' => 'pjaxSub',
							'pluginOptions' => [
								'autoclose' => true,
								'format' => 'dd-mm-yyyy', //'dd-mm-yyyy hh:ii',
								'minuteStep' => 1,
								'minView' => 2,
								'endDate' => '+0d',
								'todayHighlight' => true,
							],
						]),
						'contentOptions' => [
							'class' => 'value-cell',
						],
					],
				];
				
				$form_submission = json_decode($formSumbission->form_submission);
				foreach($form_submission as $elem) {
					$id = $elem->id . '_' . $elem->number . '_' . $elem->label;
					$submission[$id] = $elem->value;
					$filterModel[$id] = $request->get('Submission')[$id];
					$_columns[$id] = [
						'attribute' => $id,
						'format' => 'html',
						'label' => $elem->label,
						'filter' => '<input class="form-control" name="Submission[' . $id . ']" value="' . $filterModel[$id] . '" type="text" />',
						'contentOptions' => [
							'class' => 'value-cell',
						],
						'value' => function($model, $key, $index, $column) {
							return preg_replace('/\r?\n/', '<br />', $model[$column->attribute]);
						},
					];
				}

				$submissions[] = $submission;
				$columns = ArrayHelper::merge($columns, $_columns);
				
			}
			
			foreach ($submissions as $idx => $submission) {
				$present = true;
				foreach ($filterModel as $field => $value) {
					if (!empty($value)) {
						if (strpos($submission[$field], $value) === false) {
							$present = false;
						}
					}
				}
				if (!$present) {
					ArrayHelper::removeValue($submissions, $submission);
				}
			}
			
		}
		
		$dataProvider = new ArrayDataProvider([
			'allModels' => $submissions,
			'key' => 'id',
			'pagination' => [
				'pageSize' => 10,
			],
			'sort' => [
				'attributes' => array_keys($columns),
			],
		]);
		
		return $this->render('index', [
			'form' => $form,
			'dataProvider' => $dataProvider,
			'columns' => $columns,
			'filterModel' => $filterModel,
		]);
	}
	
	public function actionSetAsRead($id) {
		Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
		
		$request = Yii::$app->request;
		
		$result = 'OK';
		
		$submission = FormSubmission::findOne($id);
		$form = Form::getUsersForm($submission->form_id);
		if (!$form || !$submission) {
			
			$result = $this->goneBadError();
			
		} else {
			
			$submission->setAsRead((bool)$request->post('read'));

		}
		
		return $result;
	}
	
	public function actionDelete($id) {
		Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
		
		$request = Yii::$app->request;
		
		$result = 'OK';
		
		$submission = FormSubmission::findOne($id);
		$form = Form::getUsersForm($submission->form_id);
		if (!$form || !$submission) {
			
			$result = $this->goneBadError();
			
		} else {
			
			$submission->delete();

		}
		
		return $result;
	}
	
	public function actionGetNewSubmissionsCount($id)
	{
		Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
		$result = [
			'submissions' => 0,
			'error' => [
				'status' => false,
				'text' => ''
			]
		];
		
		$request = Yii::$app->request;
		
		$form = Form::getUsersForm($id);
			
		if (!$form) {
			
			$result['error']['status'] = true;
			$result['error']['text'] = $this->goneBadError();
			
		} else {
		
			$result['submissions'] = $form->getNewFormSubmissionsCount();
			
		}
		
		return $result;
	}
	
	private function goneBadError() {
		$msg = Yii::t('site', 'Sorry, could not complete the operation. Parameter values are not valid.');
		Yii::$app->session->setFlash('error', $msg);
		Yii::$app->session->setFlash('hasErrors', true);
		
		return $msg;
	}
	
}
