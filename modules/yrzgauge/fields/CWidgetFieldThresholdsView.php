<?php declare(strict_types = 0);

use  Modules\YrzGauge\Fields\CWidgetFieldThresholds;

class CWidgetFieldThresholdsView extends CWidgetFieldView {

	public function __construct(CWidgetFieldThresholds $field) {
		$this->field = $field;
	}

	public function getView(): CTable {
		$thresholds = $this->field->getValue();

		$thresholds_table = (new CTable())
			->setId('thresholds_table_'.$this->field->getName())
			->addClass('table-thresholds')
			->addClass(ZBX_STYLE_TABLE_INITIAL_WIDTH);

		$i = 0;

		foreach ($thresholds as $threshold) {
			$thresholds_table->addItem($this->getRowTemplate($threshold, $i));
			$i++;
		}

		$thresholds_table->addRow(
			(new CCol(
				(new CButton('thresholds_add', _('Add')))
					->addClass(ZBX_STYLE_BTN_LINK)
					->addClass('element-table-add')
					->setId('threshold-add')
					->setEnabled(!$this->isDisabled())
			))->setColSpan(3)
		);

		return $thresholds_table;
	}

	public function getJavaScript(): string {
		return '
			jQuery("#thresholds_table_'.$this->field->getName().'")
				.dynamicRows({template: "#'.$this->field->getName().'-row-tmpl"})
		';
	}

	public function getTemplates(): array {
		return [
			new CTemplateTag($this->field->getName().'-row-tmpl', $this->getRowTemplate(CWidgetFieldThresholds::DEFAULT_THRESHOLD))
		];
	}

	private function getRowTemplate(array $threshold, $row_num = '#{rowNum}'): CRow {
		return (new CRow([
			(new CColor($this->field->getName().'['.$row_num.'][color]', $threshold['color']))
				->appendColorPickerJs(false),

			(new CNumericBox($this->field->getName().'['.$row_num.'][threshold]', $threshold['threshold']))
				->setWidth(ZBX_TEXTAREA_FILTER_SMALL_WIDTH)
				->setEnabled(!$this->isDisabled() || $row_num === '#{rowNum}')
				->setAttribute('placeholder', _('threshold')),

			(new CCol(
				(new CButton($this->field->getName().'['.$row_num.'][remove]', _('Remove')))
					->addClass(ZBX_STYLE_BTN_LINK)
					->addClass('element-table-remove')
					->setEnabled(!$this->isDisabled() || $row_num === '#{rowNum}')
			))->addClass(ZBX_STYLE_NOWRAP)
		]))->addClass('form_row');
	}
}
