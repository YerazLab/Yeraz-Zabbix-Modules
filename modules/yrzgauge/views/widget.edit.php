<?php declare(strict_types = 0);

use Modules\YrzGauge\Fields\CWidgetFieldThresholds;

require_once dirname(__FILE__).'/../fields/CWidgetFieldThresholdsView.php';

$units_select = new CWidgetFieldSelectView($data['fields']['units_select']);
$units_value = (new CWidgetFieldTextBoxView($data['fields']['units_value']))
    ->setPlaceholder(_('value'))
    ->setWidth(ZBX_TEXTAREA_TINY_WIDTH);

$decimals_select = new CWidgetFieldSelectView($data['fields']['decimals_select']);
$decimals_value = (new CWidgetFieldIntegerBoxView($data['fields']['decimals_value']));

$thickness_select = new CWidgetFieldSelectView($data['fields']['thickness_select']);
$thickness_value = (new CWidgetFieldIntegerBoxView($data['fields']['thickness_value']));


(new CWidgetFormView($data))
	->addField(
		new CWidgetFieldMultiSelectItemView($data['fields']['itemid'], $data['captions']['items']['itemid'])
	)
    ->addField(
        new CWidgetFieldCheckBoxView($data['fields']['show_title'])
    )
    ->addField(
        new CWidgetFieldCheckBoxView($data['fields']['show_value'])
    )
    ->addField(
        new CWidgetFieldCheckBoxView($data['fields']['show_markers'])
    )
    ->addField(
        new CWidgetFieldCheckBoxView($data['fields']['show_needle'])
    )
	->addField(
		new CWidgetFieldRadioButtonListView($data['fields']['show_progress'])
	)
	->addField(
		new CWidgetFieldRadioButtonListView($data['fields']['angle'])
	)
    ->addItem([
        $units_select->getLabel(),
        new CFormField([
            $units_select->getView()->addClass(ZBX_STYLE_FORM_INPUT_MARGIN),
            $units_value->getView()
        ])
    ])	
    ->addItem([
        $decimals_select->getLabel(),
        new CFormField([
            $decimals_select->getView()->addClass(ZBX_STYLE_FORM_INPUT_MARGIN),
            $decimals_value->getView()
        ])
    ])
	->addField(
		new CWidgetFieldCheckBoxView($data['fields']['adv_conf']),
		'adv-conf'
	)
	->addField(
		(new CWidgetFieldColorView($data['fields']['background_color'])),
		'adv-conf-item'
	)
	->addField(
		(new CWidgetFieldColorView($data['fields']['base_color'])),
		'adv-conf-item'
	)
	->addField(
		(new CWidgetFieldThresholdsView($data['fields']['thresholds']))
			->setHint(
				makeWarningIcon(_('This setting applies only to numeric data.'))->setId('item-value-thresholds-warning')
			),
		'adv-conf-item'
	)
	->addField(
		new CWidgetFieldIntegerBoxView($data['fields']['threshold_width']),
		'adv-conf-item'
	)
	->addField(
		new CWidgetFieldIntegerBoxView($data['fields']['threshold_space']),
		'adv-conf-item'
	)
    ->addItem(
		[
			$thickness_select->getLabel()->addClass('adv-conf-item'),
			(new CFormField([
				$thickness_select->getView()->addClass(ZBX_STYLE_FORM_INPUT_MARGIN),
				$thickness_value->getView()
			]))
				->addClass('adv-conf-item')
    	]
	)
	->addField(
		(new CWidgetFieldColorView($data['fields']['title_color'])),
		'adv-conf-item'
	)
	->addField(
		(new CWidgetFieldColorView($data['fields']['needle_color'])),
		'adv-conf-item'
	)
	->includeJsFile('widget.edit.js.php')
	->addJavaScript('widget_yrzgauge_form.init('.json_encode([
		'color_palette' => CWidgetFieldThresholds::DEFAULT_COLOR_PALETTE,
		'thresholds' => ($data['fields']['thresholds'])->getValue()
	], JSON_THROW_ON_ERROR).');')
    ->show();