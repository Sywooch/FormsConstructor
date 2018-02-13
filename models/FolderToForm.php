<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class FolderToForm extends ActiveRecord
{

	public static function tableName()
    {
        return '{{folder_to_form}}';
    }
	
}
