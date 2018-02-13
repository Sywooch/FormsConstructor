<?php

namespace app\models;

use yii\base\Model;

class ImageUpload extends Model
{
    public $imageFile;

    public function rules()
    {
        return [
            [['imageFile'], 'image', 'skipOnEmpty' => false, 'extensions' => 'png, jpg, jpeg, gif, bmp', 'maxSize' => 1024 * 1024],
        ];
    }
}