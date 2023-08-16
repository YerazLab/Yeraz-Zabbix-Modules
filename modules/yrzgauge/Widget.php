<?php declare(strict_types = 0);

namespace Modules\YrzGauge;

use Zabbix\Core\CWidget;

class Widget extends CWidget {

    public const UNIT_AUTO = 0;
    public const UNIT_STATIC = 1;

	public function getDefaultName(): string {
		return _('Gauge');
	}
}