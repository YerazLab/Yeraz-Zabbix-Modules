<?php

use Modules\YrzHtml\Widget;

(new CWidgetView($data))
    ->addItem(
        (new CDiv($data['fields_values']['html']))
            ->addClass('yrzhtml')
    )
    ->setVar('fields_values', $data['fields_values'])
    ->show();