<?php declare(strict_types = 0);

namespace Modules\YrzHtml\Includes;

use Zabbix\Widgets\{
	CWidgetField,
	CWidgetForm
};

use Zabbix\Widgets\Fields\{
	CWidgetFieldCheckBox,
	CWidgetFieldCheckBoxList,
	CWidgetFieldColor,
	CWidgetFieldIntegerBox,
	CWidgetFieldRadioButtonList,
	CWidgetFieldSelect,
	CWidgetFieldTextBox,
	CWidgetFieldTextArea
};

use Modules\YrzHtml\Widget;

class WidgetForm extends CWidgetForm {

	public function addFields(): self {
		return $this
			->addField(
				(new CWidgetFieldTextArea('html', _('Html')))
					->setFlags(CWidgetField::FLAG_LABEL_ASTERISK)
			)
			->addField(
				(new CWidgetFieldColor('color', _('Color')))
					->setDefault('FFFFFF')
			)
			->addField(
				(new CWidgetFieldColor('background_color', _('Background color')))
			)
			->addField(
				(new CWidgetFieldIntegerBox('padding', _('Padding')))
					->setDefault(0)
			)
			->addField(
				(new CWidgetFieldRadioButtonList('horizontal_align', _('Horizontal align'), [
					0 => _('Left'),
					1 => _('Center'),
					2 => _('Righted')
				]))
					->setDefault(1)
			)
			->addField(
				(new CWidgetFieldRadioButtonList('vertical_align', _('Vertical align'), [
					0 => _('Top'),
					1 => _('Middle'),
					2 => _('Bottom')
				]))
					->setDefault(1)
			);
	}
}
