<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\helpers\Url;
use app\models\Form;
use app\models\FormElement;
use app\models\Param;
use app\models\FormView;
use app\models\FormSubmission;

class FormController extends Controller
{
	public $layout = 'form';
   
	public function actionIndex($form_id)
	{
		$request = Yii::$app->request;
		
		$form = Form::findOne($form_id);
		if (!$form_id || !$form) {
			
			return $this->goHome();
			
		} else {
			
			$formParams = Param::getParams('form', true);
	
			$form_params = json_decode($form->form_params, true);		
			foreach($formParams as $param) {
				if (!isset($form_params[$param['id']])) {
					$form_params[$param['id']] = $param['default_value'];
				}
			}
			$form->form_params = json_encode($form_params);
			
			$formSettings = Param::getParams('setting', true);
			
			$form_settings = json_decode($form->form_settings, true);		
			foreach($formSettings as $setting) {
				if (!isset($form_settings[$setting['id']])) {
					$form_settings[$setting['id']] = $setting['default_value'];
				}
			}
			$form->form_settings = json_encode($form_settings);
			
			$formElements = FormElement::find()
				->with('elementParams.param')
				->asArray()
				->all();
			
			$form_elements = json_decode($form->form_elements, true);		
			foreach($form_elements as &$page) {
				foreach($page as &$form_element) {
					
					$formElement = $formElements[ array_search($form_element['id'], array_column($formElements, 'id')) ];
		
					foreach($formElement['elementParams'] as $elementParam) {
						$param_id = (string)$elementParam['param_id'];
						if (!isset($form_element['params'][$param_id])) {
							$defaultValue = $elementParam['default_value'] ?? $elementParam['param']['default_value'];
							$form_element['params'][$param_id] = $defaultValue;
						}
					}
					
				}
			}
			$form->form_elements = json_encode($form_elements);
			
			if ($request->post('subUserForm')) {

				$submission = new FormSubmission();
				$submission->form_id = $form->id;
				
				$form_submission = [];
				foreach($form_elements as &$page) {
					foreach($page as &$form_element) {
						$elemSubmission = $this->getFormElementSubmission($request, $form_element, $formElements);
						if ($elemSubmission != null) {
							$form_submission[] = $elemSubmission;
						}
						
					}
				}
				$submission->form_submission = json_encode($form_submission);
				$submission->client_ip = Yii::$app->getRequest()->getUserIP();
				$submission->save();
				$submission->refresh();
				
				$email = $form->getFormSetting('submit_email', $formSettings);
				if (!empty($email)) {
					$body = $this->generateMailBody($submission);
					Yii::$app->mailer->compose()
						->setFrom('fc@clockworkdev.ru')
						->setTo($email)
						->setSubject('FC Form Submission - ' . $form->name)
						->setHtmlBody($body)
						->send();
				}
			
				Yii::$app->session->setFlash('userFormSubmited');
			
			} else {
				
				$view = new FormView();
				$view->form_id = $form->id;
				$view->client_ip = Yii::$app->getRequest()->getUserIP();
				$view->save();
				
			}
			
			return $this->render('index', [
				'form' => $form,
				'formParams' => $formParams,
				'formSettings' => $formSettings,
				'formElements' => $formElements,
			]);
			
		}
	}
	
	private function getFormElementSubmission($request, $form_element, $formElements) {
		$formElement = $formElements[ array_search($form_element['id'], array_column($formElements, 'id')) ];
		
		$value = null;
		$name = $formElement['name'] . '_' . $form_element['id'] . '_' . $form_element['number'];
		switch($formElement['name']) {
			
			case 'text_field':
			case 'select_field':
			case 'radio_field':
			case 'date_field':
				$value = $request->post('UserForm')[$name];
				break;
				
			case 'text_area':
				//$value = preg_replace('/\r?\n/', '<br />', $request->post('UserForm')[$name]);
				$value = $request->post('UserForm')[$name];
				break;
				
			case 'checkbox_field':
				$value = implode("\r\n", $request->post('UserForm')[$name]);
				break;
			
			case 'time_field':
				$hourValue = $request->post('UserForm')[$name . '_hour'];
				$minuteValue = $request->post('UserForm')[$name . '_minute'];
				$meridiemValue = $request->post('UserForm')[$name . '_meridiem'];
				$value = $hourValue . ':' . $minuteValue . ($meridiemValue ? ' ' . $meridiemValue : '');
				break;
				
			default:
				break;
			
		}

		if (isset($value)) {
			$elemSubmission = [
				'id' => $form_element['id'],
				'number' => $form_element['number'],
				'label' => $form_element['params']['1'],
				'value' => $value,
			];
		} else {
			$elemSubmission = null;
		}
		
		return $elemSubmission;
	}
	
	private function generateMailBody($submission)
	{
		$form_submission = json_decode($submission->form_submission);
		$body = '<table>';
		$body .= '<tr><td style="vertical-align: top;"><b>' . Yii::t('site', 'Date Submitted') . ':</b></td><td>' . $submission->sub_date . '</td><tr>';
		foreach($form_submission as $field) {
			$body .= '<tr>';
			$body .= '<td style="vertical-align: top;"><b>' . $field->label . ':</b></td>';
			$body .= '<td>' . $field->value . '</td>';
			$body .= '<tr>';
		}
		$body .= '</table>';
		return $body;
	}
	
}
