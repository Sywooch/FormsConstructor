<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\web\UploadedFile;
use yii\helpers\Url;
use yii\helpers\FileHelper;
use yii\helpers\ArrayHelper;
use yii\bootstrap\Html;
use yii\data\ArrayDataProvider;
use app\models\Form;
use app\models\Folder;
use app\models\Pattern;
use app\models\FormElement;
use app\models\Param;
use app\models\FormToFormFile;
use app\models\FormFile;
use app\models\FormSubmission;
use app\models\ImageUpload;

class ConstructorController extends Controller
{

    public function actionIndex($folder_id = null, $form_id = null)
    {
        Url::remember();
		
		if (!$form_id) {
			return $this->indexFolder($folder_id);
		} else {
			return $this->indexForm($form_id);
		}
    }
	
	public function indexFolder($folder_id = null) 
	{
		if (
			$folder_id
			&& !Folder::find()->where(['user_id' => Yii::$app->user->id, 'id' => $folder_id,])->exists()
		) {
			return $this->redirect(['index']);
		}
		
		$dirPath = $this->getFullPath($folder_id);

		$folders = $this->getChildFolders($folder_id);
		
		$forms = Form::find()
			->joinWith('folder')
			->where([
				'form.user_id' => Yii::$app->user->id,
				'folder.id' => $folder_id,
			])
			->all(); 
		
		return $this->render('index', [
            'folder_id' => $folder_id,
			'dirPath' => $dirPath,
			'folders' => $folders,
			'forms' => $forms,
        ]);
	}
	
	public function indexForm($form_id) 
	{
		$form = Form::getUsersForm($form_id);
		
		if (!$form) {
			return $this->redirect(['index']);
		}
		
		$formParams = Param::getParams('form', true);
		$formParams = $this->translateParams($formParams);

		$form_params = json_decode($form->form_params, true);		
		foreach($formParams as $param) {
			if (!isset($form_params[$param['id']])) {
				$form_params[$param['id']] = $param['default_value'];
			}
		}
		$form->form_params = json_encode($form_params);
		
		$formSettings = Param::getParams('setting', true);
		$formSettings = $this->translateParams($formSettings);
		
		$form_settings = json_decode($form->form_settings, true);		
		foreach($formSettings as $setting) {
			if (!isset($form_settings[$setting['id']])) {
				$form_settings[$setting['id']] = $setting['default_value'];
			}
		}
		$form->form_settings = json_encode($form_settings);
		
		$formElements = FormElement::find()
			->with('elementParams.param')
			->orderBy('order')
			->asArray()
			->all();
		$formElements = $this->translateFormElements($formElements);
		
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
		
		$this->view->params['fullwidth'] = true;
		return $this->render('index', [
			'form' => $form,
			'formParams' => $formParams,
			'formSettings' => $formSettings,
			'formElements' => $formElements,
        ]);
	}
	
	/* FOLDER */
	public function actionAddFolder($folder_id = null)
    {
		$request = Yii::$app->request;
		
		$folder = new Folder();
		$folder->user_id = Yii::$app->user->id;
		$folder->parent_id = $folder_id;

		if (
			$folder->parent_id != null
			&& !Folder::find()->where(['id' => $folder->parent_id, 'user_id' => $folder->user_id])->exists()
		) {
			
			$this->goneBadError();
		
		} else {
			
			if (
				$request->post('subModalForm')
				&& $folder->load($request->post())
				&& $folder->validate()
			) {
	
				$folder->save();
				
				Yii::$app->session->setFlash('modalFormSubmited');
			
			} else {
				Yii::$app->session->setFlash('hasErrors', true);
			}
			
		}
		
		return $this->renderAjax('formsbrowser/_addfolder', [
			'folder' => $folder,
		]);
	}
	
	public function actionEditFolder($id)
    {
		$request = Yii::$app->request;
		
		$folder = Folder::find()
			->where([
				'id' => $id, 
				'user_id' => Yii::$app->user->id
			])
			->one();

		if (!$folder) {
			
			$this->goneBadError();
		
		} else {
			
			if (
				$request->post('subModalForm')
				&& $folder->load($request->post())
				&& $folder->validate()
			) {
	
				$folder->save();
				
				Yii::$app->session->setFlash('modalFormSubmited');
			
			} else {
				Yii::$app->session->setFlash('hasErrors', true);
			}
			
		}
		
		return $this->renderAjax('formsbrowser/_editfolder', [
			'folder' => $folder,
		]);
	}
	
	public function actionDeleteFolder($id)
    {
		$request = Yii::$app->request;
		
		$folder = Folder::find()
			->with('forms')
			->where([
				'folder.id' => $id, 
				'folder.user_id' => Yii::$app->user->id
			])
			->one();
		$parentFolder = Folder::findOne($folder->parent_id);

		if (!$folder) {
			
			$this->goneBadError();
		
		} else {
			
			if ($request->post('subModalForm')) {

				$this->deleteFolder($folder, $parentFolder);
			
				Yii::$app->session->setFlash('modalFormSubmited');
				
			}
			
		}
		
		return $this->renderAjax('formsbrowser/_deletefolder', [
			'folder' => $folder,
			'parentFolder' => $parentFolder,
		]);
	}
	
	private function deleteFolder($folder, $parentFolder) {
		
		$childFolders = Folder::find()
			->with('forms')
			->where(['folder.parent_id' => $folder->id])
			->all();
		foreach($childFolders as $childFolder) {
			$this->deleteFolder($childFolder, $parentFolder);
		}			
		
		foreach($folder->forms as $form) {
			$folder->unlink('forms', $form, true);
			if ($parentFolder != null) {
				$form->link('folder', $parentFolder);
			}
		}
		
		$folder->delete();
		
	} 
	
	/* FORM */
	public function actionAddForm($folder_id = null)
    {
		$request = Yii::$app->request;
		
		$form = new Form();
		$form->user_id = Yii::$app->user->id;
		$folder = Folder::find()
			->where([
				'id' => $folder_id, 
				'user_id' => Yii::$app->user->id
			])
			->one() 
			?: new Folder();
		
		$patterns = Pattern::find()->all();
		
		if ($folder_id && !$folder->id) {
			
			$this->goneBadError();
			
		} else {
			
			if (
				$request->post('subModalForm')
				&& $form->load($request->post()) 
				&& $form->validate()
			) {
				
				$pattern = 
					Pattern::findOne($request->post('Pattern')['id']) 
					?? Pattern::findOne(1);
				$form->form_params = $pattern->form_params;
				$form->form_elements = $pattern->form_elements;
				
				$form->save();	
				if ($folder->id != null) {
					$form->link('folder', $folder);
				}
				
				Yii::$app->session->setFlash('modalFormSubmited');
			
			} else {
				Yii::$app->session->setFlash('hasErrors', true);
			}
			
		}
		
		return $this->renderAjax('formsbrowser/_addform', [
			'form' => $form,
			'folder' => $folder,
			'patterns' => $patterns,
		]);
	}
	
	public function actionEditForm($id)
    {
		$request = Yii::$app->request;
		
		$form = Form::getUsersForm($id);

		if (!$form) {
			
			$this->goneBadError();
		
		} else {
			if (
				$request->post('subModalForm')
				&& $form->load($request->post())
				&& $form->validate()
			) {
	
				$form->save();
				
				Yii::$app->session->setFlash('modalFormSubmited');
			
			} else {
				Yii::$app->session->setFlash('hasErrors', true);
			}
			
		}
		
		return $this->renderAjax('formsbrowser/_editform', [
			'form' => $form,
		]);
	}
	
	public function actionDeleteForm($id)
    {
		$request = Yii::$app->request;
		
		$form = Form::find()
			->with('folder')
			->where([
				'form.id' => $id, 
				'form.user_id' => Yii::$app->user->id
			])
			->one();

		if (!$form) {
			
			$this->goneBadError();
		
		} else {
			
			if ($request->post('subModalForm')) {

				if ($form->folder) {
					$form->unlink('folder', $form->folder, true);	
				}
				$form->delete();
				
				Yii::$app->session->setFlash('modalFormSubmited');
		
			}
			
		}
		
		return $this->renderAjax('formsbrowser/_deleteform', [
			'form' => $form,
		]);
	}
	
	public function actionMoveFolderToFolder($id)
	{
		$request = Yii::$app->request;
		
		$folder = Folder::find()
			->where([
				'id' => $id, 
				'user_id' => Yii::$app->user->id
			])
			->one();
		
		$parentFolder = Folder::find()
			->where([
				'id' => $request->post('Folder')['parent_id'], 
				'user_id' => Yii::$app->user->id
			])
			->one();
		
		$dirPath = [];
		$folders = null;
		
		if (
			!$folder
			|| (
				$request->post('Folder')['parent_id'] 
				&& (!$parentFolder || $parentFolder->id == $folder->id)
			)
		) {
			
			$this->goneBadError();
			
		} else if ($request->post('subModalForm')) {
				
			$folder->parent_id = $parentFolder ? $parentFolder->id : null;
			$folder->save();
			
			Yii::$app->session->setFlash('modalFormSubmited');
		
		} else {
			
			$folder_id = $parentFolder ? $parentFolder->id : null;
			$dirPath = $this->getFullPath($folder_id);
			$folders = $folders = $this->getChildFolders($folder_id);
			
		}
		
		return $this->renderAjax('formsbrowser/_movefoldertofolder', [
			'folder' => $folder,
			'parentFolder' => $parentFolder,
			'dirPath' => $dirPath,
			'folders' => $folders,
		]);
	}
	
	public function actionMoveFormToFolder($id)
	{
		$request = Yii::$app->request;
		
		$form = Form::find()
			->with('folder')
			->where([
				'form.id' => $id, 
				'form.user_id' => Yii::$app->user->id
			])
			->one();
		
		$folder = Folder::find()
			->where([
				'id' => $request->post('Folder')['id'], 
				'user_id' => Yii::$app->user->id
			])
			->one();
		
		$dirPath = [];
		$folders = null;
		
		if (!$form || ($request->post('Folder')['id'] && !$folder)) {
			
			$this->goneBadError();
			
		} else if ($request->post('subModalForm')) {

			if ($form->folder) {
				$form->unlink('folder', $form->folder, true);
			}
			if ($folder) {
				$form->link('folder', $folder);
			}
			
			Yii::$app->session->setFlash('modalFormSubmited');
		
		} else {
			
			$folder_id = $folder ? $folder->id : null;
			$dirPath = $this->getFullPath($folder_id);
			$folders = $this->getChildFolders($folder_id);
			
		}
		
		return $this->renderAjax('formsbrowser/_moveformtofolder', [
			'form' => $form,
			'folder' => $folder,
			'dirPath' => $dirPath,
			'folders' => $folders,
		]);
	}
	
	public function actionUploadImage($id)
	{		
		Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
		
		$result = [
			'file' => '',
			'error' => [
				'status' => false,
				'text' => ''
			]
		];
		
		$form = Form::getUsersForm($id);
		
		if (!$form) {
			
			$result['error']['status'] = true;
			$result['error']['text'] = $this->goneBadError();
			
			return $result;
		}
		
		$img = new ImageUpload();
		$img->imageFile = UploadedFile::getInstance($img, 'imageFile');
		if ($img->validate()) {
			
			$path = 'uploads/' . Yii::$app->user->id . '/' . $form->id . '/';
			FileHelper::createDirectory($path);
			$fname = uniqid(rand(), true) . '.' . $img->imageFile->extension;
			$fullPath = $path . $fname;
			$img->imageFile->saveAs($fullPath);
		
			$result['file'] = $fullPath;
			
			$formFile = new FormFile();
			$formFile->name = $fname;
			$formFile->file_type = 1;
			$formFile->save();
			
			$form->link('formFiles', $formFile);
		
		} else {
			$result['error']['status'] = true;
			$result['error']['text'] = $img->getFirstError('imageFile');
		}
		
		return $result;
	}
	
	public function actionImageDelete($id)
	{
		Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
		
		$formFile = FormFile::find()
			->with('formFormFile')
			->where([
				'form_file.id' => $id, 
				'form_file.file_type' => 1,
			])
			->one();
		
		if (!$formFile) {
			return $this->goneBadError();
		}
		
		$form = Form::getUsersForm($formFile->formFormFile->form_id);
		
		if (!$form) {
			return $this->goneBadError();
		}
		
		$path = 'uploads/' . Yii::$app->user->id . '/' . $form->id . '/';
		$fname = $formFile->name;
		$fullPath = $path . $fname;
		unlink($fullPath);
		
		$form->unlink('formFiles', $formFile, true);
		$formFile->delete();
		
		return 'OK';
	}
	
	public function actionImageBrowse($id)
	{
		$request = Yii::$app->request;
		
		$form = Form::getUsersForm($id);
		
		$formFiles = [];
		if (!$form) {
			
			$this->goneBadError();
			
		} else {
			
			$formFiles = FormFile::find()
				->joinWith('formFormFile fff')
				->where([
					'form_file.file_type' => 1,
					'fff.form_id' => $form->id,
				])
				->all();
				
		}
		
		return $this->renderAjax('form/_imagebrowse', [
			'form' => $form,
			'images' => $formFiles,
		]);
	}
	
	public function actionPublishForm($id)
	{
		$request = Yii::$app->request;
		
		$form = Form::getUsersForm($id);
		
		if (!$form) {
			
			$this->goneBadError();
			
		}
		
		return $this->renderAjax('form/_publish', [
			'form' => $form,
		]);
	}
	
	public function actionTurnFormOnOff($id)
	{
		Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
		$result = 'OK';
		
		$request = Yii::$app->request;
		
		$form = Form::getUsersForm($id);
			
		if (!$form) {
			
			$result = $this->goneBadError();
			
		} else {
		
			$form->setFormSetting('form_active', $request->post('on'));
			
		}
		
		return $result;
	}
	
	private function getFullPath($folder_id) {
		$dirPath = [];
		$currentDir = $folder_id;
		while ($currentDir != null) {
			$dir = Folder::find()
				->where([
					'user_id' => Yii::$app->user->id,
					'id' => $currentDir,
				])
				->one();
			$currentDir = $dir->parent_id;
			
			$dirPath[$dir->id] = $dir->name;
		}
		$dirPath[0] = null;
		$dirPath = array_reverse($dirPath, true);
		
		return $dirPath;
	}
	
	private function getChildFolders($folder_id) {
		return Folder::find()
			->where([
				'user_id' => Yii::$app->user->id,
				'parent_id' => $folder_id,
			])
			->orderBy('name')
			->all();
	} 
	
	private function translateParam($param) {
		$param['label'] = Yii::t('forms', $param['label']);
		$param['help_text'] = Yii::t('forms', $param['help_text']);
		return $param;
	}
	
	private function translateParams($params) {
		foreach($params as &$param) {
			$param = $this->translateParam($param);
		}
		return $params;
	}
	
	private function translateFormElements($formElements) {
		foreach($formElements as &$formElement) {
			$formElement['label'] = Yii::t('forms', $formElement['label']);
			foreach($formElement['elementParams'] as &$elementParam) {
				$elementParam['param'] = $this->translateParam($elementParam['param']);
			}
		}
		return $formElements;
	}
	
	private function goneBadError() {
		$msg = Yii::t('site', 'Sorry, could not complete the operation. Parameter values are not valid.');
		Yii::$app->session->setFlash('error', $msg);
		Yii::$app->session->setFlash('hasErrors', true);
		
		return $msg;
	}
	
}
