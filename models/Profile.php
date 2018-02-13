<?php

/*
 * This file is part of the Dektrium project.
 *
 * (c) Dektrium project <http://github.com/dektrium/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace app\models;

use dektrium\user\traits\ModuleTrait;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "profile".
 *
 * @property integer $user_id
 * @property string  $name
 * @property string  $timezone
 * @property User    $user
 *
 * @author Dmitry Erofeev <dmeroff@gmail.com
 */
class Profile extends \dektrium\user\models\Profile
{

    /**
     * @return null
     */
    public function getAvatarUrl($size = null)
    {
        return null;
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            'timeZoneValidation'   => ['timezone', 'validateTimeZone'],
            'nameLength'           => ['name', 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'name'           => \Yii::t('user', 'Name'),
            'timezone'       => \Yii::t('user', 'Time zone'),
        ];
    }

    /**
     * @inheritdoc
     */
    public function beforeSave($insert)
    {
        return parent::beforeSave($insert);
    }

}
