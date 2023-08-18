<?php declare(strict_types = 0);

(new CWidgetFormView($data))
	->addField(
		new CWidgetFieldTextAreaView($data['fields']['html'])
	)
	->addField(
		(new CWidgetFieldColorView($data['fields']['color']))
	)
	->addField(
        new CWidgetFieldColorView($data['fields']['background_color'])
    )
	->addField(
		(new CWidgetFieldIntegerBoxView($data['fields']['padding']))
	)
	->addField(
		new CWidgetFieldRadioButtonListView($data['fields']['horizontal_align'])
	)
	->addField(
		new CWidgetFieldRadioButtonListView($data['fields']['vertical_align'])
	)
	->includeJsFile('widget.edit.js.php')
	->addJavaScript('widget_yrzhtml_form.init();')
    ->show();