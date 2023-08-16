<?php declare(strict_types = 0);

namespace Modules\YrzGauge\Actions;

use API,
	CControllerDashboardWidgetView,
	CControllerResponseData;

use Widgets\Item\Widget;
use Widgets\YrzGauge\Includes\WidgetForm;

use Zabbix\Core\CWidget;

class WidgetView extends CControllerDashboardWidgetView {

    protected function doAction(): void {

		$items = API::Item()->get([
            'output' => ['itemid', 'value_type', 'name', 'units'],
            'itemids' => $this->fields_values['itemid'],
            'webitems' => true,
            'filter' => [
                'value_type' => [ITEM_VALUE_TYPE_UINT64, ITEM_VALUE_TYPE_FLOAT]
            ]
		]);

		if (!$items) {
			$error = _('No permissions to referred object or it does not exist!');
		} else {
			$item = $items[0];

            $history = API::History()->get([
                'output' => ['value'],
                'itemids' => $item['itemid'],
                'history' => $item['value_type'],
                'sortfield' => 'clock',
                'sortorder' => ZBX_SORT_DOWN,
                'limit' => 1
            ]);	
		}

        $data = [
            'name' => $this->getInput('name', $this->widget->getName()),
            'units' => $item['units'],
            'history' => $history,
            'fields_values' => $this->fields_values,
			'user' => [
				'debug_mode' => $this->getDebugMode()
			]
        ];

		$this->setResponse(new CControllerResponseData($data));
	}
}