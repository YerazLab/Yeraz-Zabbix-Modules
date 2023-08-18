<?php declare(strict_types = 0);

namespace Modules\YrzHtml\Actions;

use API,
	CControllerDashboardWidgetView,
	CControllerResponseData;

use Widgets\Item\Widget;
use Widgets\YrzHtml\Includes\WidgetForm;

use Zabbix\Core\CWidget;

class WidgetView extends CControllerDashboardWidgetView {

    protected function doAction(): void {

        $data = [
            'name' => $this->getInput('name', $this->widget->getName()),
            'fields_values' => $this->fields_values,
			'user' => [
				'debug_mode' => $this->getDebugMode()
			]
        ];

		$this->setResponse(new CControllerResponseData($data));
	}
}