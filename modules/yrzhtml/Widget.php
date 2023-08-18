<?php declare(strict_types = 0);

namespace Modules\YrzHtml;

use Zabbix\Core\CWidget;

class Widget extends CWidget {

	public function getDefaultName(): string {
		return _('Yeraz | HTML');
	}
}