<?php declare(strict_types = 0);

namespace Modules\YrzGauge;

use Zabbix\Core\CWidget;

class Widget extends CWidget {

	public const HALIGN_LEFT = 0;
	public const HALIGN_CENTER = 1;
	public const HALIGN_RIGHT = 2;

	public const VALIGN_TOP = 0;
	public const VALIGN_MIDDLE = 1;
	public const VALIGN_BOTTOM = 2;

    public const UNIT_AUTO = 0;
    public const UNIT_STATIC = 1;

	public const DEFAULT_THICKNESS = 20;

	public function getDefaultName(): string {
		return _('Gauge');
	}
}