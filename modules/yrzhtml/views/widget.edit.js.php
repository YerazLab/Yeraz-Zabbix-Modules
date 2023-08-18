<?php
	use Modules\YrzHtml\Widget;
?>

window.widget_yrzhtml_form = new class {

	init() {
		for (const colorpicker of jQuery('.<?= ZBX_STYLE_COLOR_PICKER ?> input')) {
			jQuery(colorpicker).colorpicker(
				{ 
					appendTo: '.overlay-dialogue-body',
					use_default: true,
					onUpdate: window.setIndicatorColor
				}
			);
		}
	}
};