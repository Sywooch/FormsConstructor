<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class FormToFormFile extends ActiveRecord
{

	public function getForm()
    {
        return $this->hasOne(Form::className(), ['id' => 'form_id']);
    }

    public function getFormFile()
    {
        return $this->hasOne(FormFile::className(), ['id' => 'form_file_id']);
    }
	
	public static function tableName()
    {
        return '{{form_to_form_file}}';
    }
	
}
