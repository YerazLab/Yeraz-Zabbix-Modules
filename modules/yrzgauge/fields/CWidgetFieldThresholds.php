<?php declare(strict_types = 0);

namespace Modules\YrzGauge\Fields;

use Zabbix\Widgets\CWidgetField;

class CWidgetFieldThresholds extends CWidgetField {

	public const DEFAULT_COLOR_PALETTE = [
		'009100', 'DF8800', 'E12C00', 'B0AF07', '0EC9AC', '524BBC', 'ED1248', 'D1E754', '2AB5FF', '385CC7', 'EC1594', 
		'BAE37D', '6AC8FF', 'EE2B29', '3CA20D', '6F4BBC', '00A1FF', 'F3601B', '1CAE59', '45CFDB', '894BBC', '6D6D6D'
	];

	public const DEFAULT_VALUE = [];
	public const DEFAULT_THRESHOLD = ['threshold' => 0, 'color' => self::DEFAULT_COLOR_PALETTE[0]];

	public function __construct(string $name, string $label = null) {
		parent::__construct($name, $label);

		$this
			->setDefault(self::DEFAULT_VALUE)
			->setSaveType(ZBX_WIDGET_FIELD_TYPE_STR)
			->setValidationRules(
				['type' => API_OBJECTS, 'uniq' => [['threshold']], 'fields' => [
					'color'     => ['type' => API_COLOR, 'flags' => API_REQUIRED | API_NOT_EMPTY],
					'threshold' => ['type' => API_NUMERIC, 'flags' => API_REQUIRED]
			]]);
	}

	public function getValue() {
		$value = parent::getValue();

		foreach ($value as $index => $val) {
			if ($val['threshold'] === 0 && $val['color'] === '') {
				unset($value[$index]);
			}
		}

		return $value;
	}

	public function setValue($value): self {
		$this->value = (array) $value;

		return $this;
	}

	public function toApi(array &$widget_fields = []): void {
		$value = $this->getValue();

		foreach ($value as $index => $val) {
			$widget_fields[] = [
				'type' => $this->save_type,
				'name' => $this->name.'.color.'.$index,
				'value' => $val['color']
			];
			$widget_fields[] = [
				'type' => $this->save_type,
				'name' => $this->name.'.threshold.'.$index,
				'value' => $val['threshold']
			];
		}
	}
}
