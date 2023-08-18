<?php declare(strict_types = 0);

namespace Modules\YrzEnhancer\Includes;

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
	CWidgetFieldTextBox
};

use Modules\YrzEnhancer\Widget;

class WidgetForm extends CWidgetForm {

	public function addFields(): self {
		return $this
			->addField(
				(new CWidgetFieldRadioButtonList('enable', _('Enable'), [
					0 => _('No'),
					1 => _('Yes'),
				]))
					->setDefault(0)
			)
			->addField(
				(new CWidgetFieldColor('body_background_color', _('Body background color')))
					->setDefault('2b2b2b')
			)
			->addField(
				(new CWidgetFieldIntegerBox('dashboard_padding', _('Dashboard padding')))
					->setDefault(0)
			)
			->addField(
				(new CWidgetFieldColor('widget_background_color', _('Widget background color')))
					->setDefault('2b2b2b')
			)
			->addField(
				(new CWidgetFieldColor('widget_border_color', _('Widget border color')))
					->setDefault('2b2b2b')
			)
			->addField(
				(new CWidgetFieldCheckBox('widget_border_show', _('Show widget border')))
					->setDefault(0)
			)
			->addField(
				(new CWidgetFieldIntegerBox('widget_margin', _('Widget margin')))
					->setDefault(0)
			);
	}
}
