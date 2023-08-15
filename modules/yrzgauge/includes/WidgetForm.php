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
				(new CWidgetFieldSelect('min_select', _('Min'), [
					Widget::UNIT_AUTO => _x('Auto', 'history source selection method'),
					Widget::UNIT_STATIC => _x('Static', 'history source selection method')
				]))
					->setDefault(Widget::UNIT_AUTO)
			)
			->addField(
				(new CWidgetFieldIntegerBox('min_value'))
					->setDefault(0)
			)		
			->addField(
				(new CWidgetFieldSelect('max_select', _('Max'), [
					Widget::UNIT_AUTO => _x('Auto', 'history source selection method'),
					Widget::UNIT_STATIC => _x('Static', 'history source selection method')
				]))
					->setDefault(Widget::UNIT_AUTO)
			)
			->addField(
				(new CWidgetFieldIntegerBox('max_value'))
					->setDefault(100)
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
				(new CWidgetFieldRadioButtonList('horizontal_align', _('Horizontal align'), [
					HALIGN_LEFT => _('Left'),
					HALIGN_CENTER => _('Center'),
					HALIGN_RIGHT => _('Right')
				]))
					->setDefault(HALIGN_CENTER)
					->setFlags(CWidgetField::FLAG_ACKNOWLEDGES)
			)		
			->addField(
				(new CWidgetFieldRadioButtonList('vertical_align', _('Vertical align'), [
					VALIGN_TOP => _('Top'),
					VALIGN_MIDDLE => _('Middle'),
					VALIGN_BOTTOM => _('Bottom')
				]))
					->setDefault(VALIGN_MIDDLE)
					->setFlags(CWidgetField::FLAG_ACKNOWLEDGES)
			)		
			->addField(
				(new CWidgetFieldCheckBox('adv_conf', _('Advanced configuration')))
			)
			->addField(
				(new CWidgetFieldColor('gauge_color', _('Gauge color')))
					->allowInherited()
			)
			->addField(
				(new CWidgetFieldColor('value_color', _('Value color')))
					->allowInherited()
			)
			->addField(
				(new CWidgetFieldThresholds('thresholds', _('Thresholds')))
			)
			->addField(
				(new CWidgetFieldIntegerBox('threshold_width', _('Treshold width')))
					->setDefault(2)
					->setFlags(CWidgetField::FLAG_NOT_EMPTY | CWidgetField::FLAG_LABEL_ASTERISK)
			)	
			->addField(
				(new CWidgetFieldIntegerBox('threshold_space', _('Treshold space')))
					->setDefault(1)
					->setFlags(CWidgetField::FLAG_NOT_EMPTY | CWidgetField::FLAG_LABEL_ASTERISK)
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
			)
			->addField(
				(new CWidgetFieldSelect('title_text_size_select', _('Title text size'), [
					Widget::UNIT_AUTO => _('Auto'),
					Widget::UNIT_STATIC => _('Static')
				]))
					->setDefault(Widget::UNIT_AUTO)
			)
			->addField(
				(new CWidgetFieldIntegerBox('title_text_size_value', null, 1, 100))
					->setDefault(35)
			)	
			->addField(
				(new CWidgetFieldSelect('value_text_size_select', _('Value text size'), [
					Widget::UNIT_AUTO => _('Auto'),
					Widget::UNIT_STATIC => _('Static')
				]))
					->setDefault(Widget::UNIT_AUTO)
			)
			->addField(
				(new CWidgetFieldIntegerBox('value_text_size_value', null, 1, 100))
					->setDefault(25)
			);
	}
}
