<?php declare(strict_types = 0);

namespace Modules\YrzGauge\Actions;

use API,
	CControllerDashboardWidgetView,
	CControllerResponseData,
    CRangeTimeParser,
    CSettingsHelper;

use Widgets\Item\Widget;
use Widgets\YrzGauge\Includes\WidgetForm;

use Zabbix\Core\CWidget;

class WidgetView extends CControllerDashboardWidgetView {

	protected function init(): void {
		parent::init();

		$this->addValidationRules([
			'from' => 'string',
			'to' => 'string'
		]);
	}

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

            $range_time_parser = new CRangeTimeParser();

            $range_time_parser->parse($this->getInput('from'));
            $time_from = $range_time_parser->getDateTime(true)->getTimestamp();

            $range_time_parser->parse($this->getInput('to'));
            $time_to = $range_time_parser->getDateTime(false)->getTimestamp();    

            $limit = CSettingsHelper::get(CSettingsHelper::SEARCH_LIMIT);
            
            $history = API::History()->get([
                'output' => ['value'],
                'itemids' => $item['itemid'],
                'history' => $item['value_type'],
                'sortfield' => 'clock',
                'sortorder' => ZBX_SORT_DOWN,
				'time_from' => $time_from - 1,
				'time_till' => $time_to + 1,
                'limit' => $limit
            ]);	
		}

        $data = [
            'name' => $this->getInput('name', $this->widget->getName()),
            'units' => $item['units'],
            'history' => $history, //_value,
            'fields_values' => $this->fields_values,
			'user' => [
				'debug_mode' => $this->getDebugMode()
			]
        ];

		$this->setResponse(new CControllerResponseData($data));
	}
}