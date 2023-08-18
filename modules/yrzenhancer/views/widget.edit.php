<?php declare(strict_types = 0);

(new CWidgetFormView($data))
	->addField(
		new CWidgetFieldRadioButtonListView($data['fields']['enable'])
	)
	->addField(
		(new CWidgetFieldColorView($data['fields']['body_background_color']))
	)	
	->addField(
		new CWidgetFieldIntegerBoxView($data['fields']['dashboard_padding'])
	)
	->addField(
		(new CWidgetFieldColorView($data['fields']['widget_background_color']))
	)
	->addField(
		(new CWidgetFieldColorView($data['fields']['widget_border_color']))
	)
	->addField(
        new CWidgetFieldCheckBoxView($data['fields']['widget_border_show'])
    )
	->addField(
		new CWidgetFieldIntegerBoxView($data['fields']['widget_margin'])
	)
	->includeJsFile('widget.edit.js.php')
	->addJavaScript('widget_yrzenhancer_form.init();')
	->show();