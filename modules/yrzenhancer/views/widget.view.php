<?php

use Modules\YrzEnhancer\Widget;

(new CWidgetView($data))
    ->addItem(
        (new CImg('modules/yrzenhancer/assets/img/icon.svg'))
    )
    ->setVar('fields_values', $data['fields_values'])
    ->show();