<?php

use Modules\YrzGauge\Widget;

(new CWidgetView($data))
    ->addItem(
        (new CDiv())
            ->addItem(
                (new CDiv('title'))
                    ->addClass('yrzgauge-title')
            )
            ->addItem(
                (new CDiv('value'))
                    ->addClass('yrzgauge-value')
            )
            ->addClass('yrzgauge')
    )
    ->setVar('history', $data['history'])
    ->setVar('fields_values', $data['fields_values'])
    ->show();