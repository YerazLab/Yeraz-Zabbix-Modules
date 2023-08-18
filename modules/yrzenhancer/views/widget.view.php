<?php

use Modules\YrzEnhancer\Widget;

(new CWidgetView($data))
    ->addItem(
        (new CDiv('Yeraz | Enhancer'))
            ->addClass('yrzenhancer')
    )
    ->setVar('fields_values', $data['fields_values'])
    ->show();