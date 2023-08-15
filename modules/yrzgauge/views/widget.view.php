<?php

use Modules\YrzGauge\Widget;

(new CWidgetView($data))
    ->addItem(new CDiv())
    ->setVar('history', $data['history'])
    ->setVar('fields_values', $data['fields_values'])
    ->show();