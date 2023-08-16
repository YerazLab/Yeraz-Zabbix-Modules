<?php declare(strict_types = 0);

namespace Modules\YrzGauge\Includes;

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
	CWidgetFieldMultiSelectItem,
	CWidgetFieldSelect,
	CWidgetFieldTextBox
};

use Modules\YrzGauge\Fields\CWidgetFieldThresholds;

use Modules\YrzGauge\Widget;

class WidgetForm extends CWidgetForm {

	public function addFields(): self {
		return $this
			->addField(
				(new CWidgetFieldMultiSelectItem('itemid', _('Item')))
					->setFlags(CWidgetField::FLAG_NOT_EMPTY | CWidgetField::FLAG_LABEL_ASTERISK)
					->setMultiple(false)
			)
			->addField(
				(new CWidgetFieldCheckBox('show_title', _('Show title')))
					->setDefault(1)
			)
			->addField(
				(new CWidgetFieldCheckBox('show_value', _('Show value')))
					->setDefault(1)
			)
			->addField(
				(new CWidgetFieldCheckBox('show_markers', _('Show markers')))
					->setDefault(0)
			)
			->addField(
				(new CWidgetFieldSelect('gauge_type', _('Gauge type'), [
					0 => '180°',
					1 => '216°',
					2 => '260°',
					3 => '360°'
				]))
					->setDefault(1)
			)
			->addField(
				(new CWidgetFieldSelect('units_select', _('Units'), [
					Widget::UNIT_AUTO => _x('Auto', 'history source selection method'),
					Widget::UNIT_STATIC => _x('Static', 'history source selection method')
				]))
					->setDefault(Widget::UNIT_AUTO)
			)	
			->addField(
				(new CWidgetFieldTextBox('units_value'))
			)		
			->addField(
				(new CWidgetFieldSelect('decimals_select', _('Decimals'), [
					Widget::UNIT_AUTO => _('Auto'),
					Widget::UNIT_STATIC => _('Static')
				]))
					->setDefault(Widget::UNIT_AUTO)
			)	
			->addField(
				(new CWidgetFieldIntegerBox('decimals_value'))
					->setDefault(0)
			)
			->addField(
				(new CWidgetFieldCheckBox('adv_conf', _('Advanced configuration')))
			)
			->addField(
				(new CWidgetFieldColor('base_color', _('Base color')))
					->setDefault('3DC51D')
			)
			->addField(
				(new CWidgetFieldThresholds('thresholds', _('Thresholds')))
			)
			->addField(
				(new CWidgetFieldIntegerBox('threshold_width', _('Treshold width')))
					->setDefault(2)
					->setFlags(CWidgetField::FLAG_NOT_EMPTY)
			)	
			->addField(
				(new CWidgetFieldIntegerBox('threshold_space', _('Treshold space')))
					->setDefault(2)
					->setFlags(CWidgetField::FLAG_NOT_EMPTY)
			)	
			->addField(
				(new CWidgetFieldSelect('thickness_select', _('Thickness'), [
					Widget::UNIT_AUTO => _('Auto'),
					Widget::UNIT_STATIC => _('Static')
				]))
					->setDefault(Widget::UNIT_AUTO)
			)	
			->addField(
				(new CWidgetFieldIntegerBox('thickness_value'))
					->setDefault(10)
			);
	}
}
