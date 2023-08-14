<?php

use Modules\YrzGauge\Widget;

(new CWidgetView($data))
    ->addItem(
        (new CDiv())
            ->addItem(
                (new CTag('SVG', true))
                    ->setAttribute('xmlns', 'http://www.w3.org/2000/svg')
                    ->setAttribute('width', '100%')
                    ->setAttribute('height', '100%')
            )
    )
    ->setVar('history', $data['history'])
    ->setVar('fields_values', $data['fields_values'])
    ->show();