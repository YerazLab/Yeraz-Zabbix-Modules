<?php
	use Modules\YrzGauge\Widget;
?>

window.widget_yrzgauge_form = new class {

	init({color_palette, thresholds}) {

		colorPalette.setThemeColors(color_palette);

		this._form = document.getElementById('widget-dialogue-form');

		this._advanced_configuration = document.getElementById('adv_conf');
		this._advanced_configuration.addEventListener('change', () => this.updateForm());

		this._units_select = document.getElementById('units_select');
		this._units_select.addEventListener('change', () => this.updateForm());
		this._units_value = document.getElementById('units_value');

		this._decimals_select = document.getElementById('decimals_select');
		this._decimals_select.addEventListener('change', () => this.updateForm());
		this._decimals_value = document.getElementById('decimals_value');

		this._latest_threshold = (thresholds.length == 0) ? 80 : parseInt(thresholds.slice(-1)[0].threshold) + 10;

		this._thickness_select = document.getElementById('thickness_select');
		this._thickness_select.addEventListener('change', () => this.updateForm());
		this._thickness_value = document.getElementById('thickness_value');

		this._colorpickerInit();
		this.updateForm();
	}

	_colorpickerInit() {
		for (const colorpicker of jQuery('.<?= ZBX_STYLE_COLOR_PICKER ?> input')) {
			jQuery(colorpicker).colorpicker(
				{ 
					appendTo: '.overlay-dialogue-body',
					use_default: true,
					onUpdate: window.setIndicatorColor
				}
			);
		}

		jQuery('#thresholds_table_thresholds').on("afteradd.dynamicRows", (e) => {
			this._addThreshold(e.target);
		});
	}

	_addThreshold(tableThresholds) {

		const used_colors = [];

		for (const color of this._form.querySelectorAll('.<?= ZBX_STYLE_COLOR_PICKER ?> input')) {
			if (color.value !== '') {
				used_colors.push(color.value);
			}
		}

		const lastThreshold = jQuery('TR.form_row', tableThresholds).last();

		jQuery('INPUT', lastThreshold).last().val(this._latest_threshold);

		this._latest_threshold += 10;

		jQuery('.<?= ZBX_STYLE_COLOR_PICKER ?> input', lastThreshold).colorpicker(
			{ appendTo: '.overlay-dialogue-body'}
		);

		jQuery.colorpicker('set_color', colorPalette.getNextColor(used_colors));
	}

	updateForm() {
		for (const element of this._form.querySelectorAll('.adv-conf-item')) {
			element.style.display = this._advanced_configuration.checked ? '' : 'none';
		}

		this._units_value.disabled = this._units_select.value == <?= Widget::UNIT_AUTO ?>;
		this._decimals_value.disabled = this._decimals_select.value == <?= Widget::UNIT_AUTO ?>;
		this._thickness_value.disabled = this._thickness_select.value == <?= Widget::UNIT_AUTO ?>;
	}	
};