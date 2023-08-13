<?php

use Modules\YrzGauge\Widget;

(new CWidgetView($data))
    ->addItem([
        (new CDiv())->addClass('chart'), null
    ])
    ->setVar('history', $data['history'])
    ->setVar('fields_values', $data['fields_values'])
    ->show();