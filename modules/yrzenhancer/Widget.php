<?php declare(strict_types = 0);

namespace Modules\YrzEnhancer;

use Zabbix\Core\CWidget;

class Widget extends CWidget {

	public function getDefaultName(): string {
		return _('Yeraz | Dashboard enhancer');
	}
}