<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class FormSubmission extends ActiveRecord
{

	public function getForm()
    {
        return $this->hasOne(Form::className(), ['id' => 'form_id']);
    }
	
	public function attributeLabels()
    {
        return [];
    }
	
	public function rules()
    {
		return [];
    }
	
	public static function tableName()
    {
        return '{{form_submission}}';
    }
	
	public function setAsRead($new = false) {
		$this->is_new = $new ? 1 : 0; 
		$this->save();
	}
	
}
