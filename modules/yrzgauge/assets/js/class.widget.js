class YrzGauge extends CWidget {

    _init() {
        super._init();

        this.configuration = null;

        this._canvas = null;
        this._chart_container = null;
        this._value = null;
 //       this._units = '';
        this._valueFontSize = 0;
        this._valueText = null;

        console.info('init');
    }   

    _processUpdateResponse(response) {

        console.info(response);

        this.configuration = {
            "angles": {
                "start": this._toRad(0.9),
                "end": this._toRad(2.1)
            },
            "limits": { 
                // max_select: response.fields_values.max_select,
                "max": response.fields_values.max_value,
                // min_select: response.fields_values.min_select,
                "min": response.fields_values.min_value,
            },
            "align": {
                "horizontal": response.fields_values.horizontal_align,
                "vertical": response.fields_values.vertical_align,
            },
            "thresholds": {
                "items": response.fields_values.thresholds,
                "width": 5,
                "space": response.fields_values.threshold_space
            },
            "margin": 50, // <!===
            "color": response.fields_values.color,
            // decimals_select: response.fields_values.decimals_select,
            //decimals_value: response.fields_values.decimals_value,
            "showTitle": response.fields_values.show_title,
            "showValue": response.fields_values.show_value,
            //thickness_select: response.fields_values.thickness_select,
            "thickness_value": response.fields_values.thickness_value,
            //title_text_size_select: response.fields_values.title_text_size_select,
            // "title_text_size_value": response.fields_values.title_text_size_value,
            //units_select: response.fields_values.units_select,
            // "units_value": response.fields_values.units_value,
            //value_text_size_select: response.fields_values.value_text_size_select,
            // "value_text_size_value": response.fields_values.value_text_size_value,
            "title": response.name
        }
        
        this._valueText = parseFloat(response.history.value).toFixed(0) + response.history.units;

        if (response.history === null) {
            this._value = null;
            this._units = '';
        }
        else {
            this._value = Number(response.history.value);
            this._units = response.history.units;
        }

        if (this._canvas === null) {
            super._processUpdateResponse(response);

            this._canvas = document.createElement('canvas');
            this._chart_container = this._content_body.querySelector('.chart');
            this._chart_container.appendChild(this._canvas);
    }

        this._resizeChart();
    }

    resize() {
        super.resize();
        console.info('Canvas resize');
        this._resizeChart();
    }

    _resizeChart() {
         console.info('Canvas resize chart');
         const ctx = this._canvas.getContext('2d');
         const dpr = window.devicePixelRatio;

         this._canvas.style.display = 'none';
         const size = Math.min(this._chart_container.offsetWidth, this._chart_container.offsetHeight);
         this._canvas.style.display = '';

         this._canvas.width = size * dpr;
         this._canvas.height = size * dpr;

         ctx.scale(dpr, dpr);

         this._canvas.style.width = `${size}px`;
         this._canvas.style.height = `${size}px`;


    //     this._refresh_frame = null;

    //     this._updatedChart();


        const layout = this._calculLayout(size);

        console.info(layout);

        this._drawTitle(ctx, layout);
        this._drawThresholds(ctx, layout);
        this._drawArc(ctx, layout, layout.width, this.configuration.angles.start, this.configuration.angles.end, this.configuration.thresholds.space, null, 'FFFFFF');
        this._drawArc(ctx, layout, layout.width, this.configuration.angles.start, this._calculateAngle(this._value), this.configuration.thresholds.space, null, this.configuration.color);
        this._drawValue(ctx, layout);
    } 
    
    _drawTitle(ctx, layout) {
        if (!this.configuration.showTitle || this.configuration.title == null) return;

        ctx.shadowBlur = 2;
        ctx.fillStyle = '#FF0000';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.configuration.title, layout.canvasSize /2, 12);
    }

    _drawValue(ctx, layout) {
        if (!this.configuration.showValue) return;

        ctx.shadowBlur = 2;
        ctx.fillStyle = '#FF0000';
        ctx.font = this._valueFontSize + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this._valueText, layout.canvasSize /2, 5 * layout.canvasSize /8);
        //$div->addClass('item-value');
    }

    _drawArc(ctx, layout, offset, startAngle, endAngle, strokeSpace, strokeWidth = null, fillStyle = null) {

        if (startAngle == endAngle) return;

        ctx.beginPath();

        console.info('Strokespace', strokeSpace);

        ctx.arc(
            layout.cx,
            layout.cy,
            layout.radius - strokeSpace,
            endAngle,
            startAngle,
            1
        );
        ctx.lineTo(
            layout.cx + (layout.radius - layout.width) * Math.cos(startAngle),
            layout.cy + (layout.radius - layout.width) * Math.sin(startAngle)
        );

        ctx.arc(
            layout.cx,
            layout.cy,
            layout.radius - offset - strokeSpace,
            startAngle,
            endAngle,
            0
        );

        // console.info('Arc', layout.cx, layout.cy, layout.radius - layout.width, startAngle, endAngle, 0);

        const origin = this._polarToCartesian(layout.cx, layout.cy, layout.radius, endAngle);

        ctx.lineTo(
            origin.x,
            origin.y);

        // console.info('Line', origin.x,origin.y);

        if (strokeWidth != null) {
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
        }

        if (fillStyle != null) {
            ctx.fillStyle = '#' + fillStyle;
            ctx.fill();
        }
    }

    _drawThresholds(ctx, layout) {
        if (!this.configuration.thresholds.items.length) return;

        var angleFrom = this.configuration.angles.start;

        for (var i = 0; i < this.configuration.thresholds.items.length; i++) {
            var threshold = this.configuration.thresholds.items[i].threshold;
            var color = this.configuration.thresholds.items[i].color;
            var angleTo = this._calculateAngle(threshold);

            if (i == this.configuration.thresholds.items.length -1) angleTo = this.configuration.angles.end;

            this._drawArc(
                ctx,
                layout,
                -this.configuration.thresholds.width,
                angleFrom,
                angleTo,
                0,
                null,
                color
            );

            angleFrom = angleTo;
        }
    }

    _calculateAngle(value) {
        var angle =
            this.configuration.angles.start
                + (this.configuration.angles.end - this.configuration.angles.start)
                    * ((value - this.configuration.limits.min) / (this.configuration.limits.max - this.configuration.limits.min));

        if (angle < this.configuration.angles.start) {
            angle = this.configuration.angles.start;
        } else if (angle > this.configuration.angles.end) {
            angle = this.configuration.angles.end;
        }
        return angle;        
    }

    _polarToCartesian(x, y, radius, angle) {
        return {
            "x": x + radius * Math.cos(angle),
            "y": y + radius * Math.sin(angle)
        }
    }    

    _toRad(angle) {
        return angle * Math.PI;
    }

    _getFontScale(length) {
        if (length > 12) return 1 - (length * 5) / 110;
        return 1 - (length * 5) / 101;
    }

    _calculLayout(canvasSize) {
        const thresholdWidth = (this.configuration.thresholds.items.length > 0) ? this.configuration.thresholds.width : 0;

        const maxRadiusH = (canvasSize / 2) - thresholdWidth;
        // console.info('maxRadius H', maxRadiusH);

        const dAngle = (this.configuration.angles.end - this.configuration.angles.start) / 100;
        // console.info('dAngle', dAngle);

        var heightRatioV = -1;
      
        for (var i = this.configuration.angles.start; i < this.configuration.angles.end; i += dAngle) {
            heightRatioV = Math.max(heightRatioV, Math.sin(i));
        }

        heightRatioV = Math.max(heightRatioV, Math.sin(this.configuration.angles.end));
        // console.info('heightRatioV', heightRatioV);

        var outerRadiusV = canvasSize / (1 + heightRatioV);
        // console.info('outerRadiusV 1', outerRadiusV);

        if (outerRadiusV * heightRatioV < this.configuration.margin + (this._valueFontSize / 2))
            outerRadiusV = canvasSize - this.configuration.margin - (this._valueFontSize / 2);

        // console.info('outerRadiusV 2', outerRadiusV);
        // console.info('ValueMargin', this.configuration.margin);
        // console.info('ValueFontSize', this._valueFontSize);

        const maxRadiusV = outerRadiusV - thresholdWidth;

        var radius = Math.min(maxRadiusH, maxRadiusV);
        // console.info('maxRadiusV', maxRadiusV);
        // console.info('radius', radius);
   
        var width = canvasSize;
        // console.info('width 1', width);

        if (width >= radius) width = Math.max(3, radius / 3);

        width = this.configuration.thickness_value;
        console.info('width 3', width);

        const outerRadius = thresholdWidth + radius;
        // console.info('outerRadius ', outerRadius);

        const gaugeOuterHeight = Math.max(outerRadius * (1 + heightRatioV), outerRadius + this.configuration.margin + (this._valueFontSize / 2));
        // console.info('gaugeOuterHeight ', gaugeOuterHeight);

        var cx = canvasSize / 2;
        // console.info('cx', cx);
        var cy = thresholdWidth + radius;
        // console.info('cy', cy);

        const blank = canvasSize - gaugeOuterHeight;
        // console.info('blank', blank);
        const offsetY = (blank / 2);
        // console.info('offsetY', offsetY)
        cy += offsetY;
        // console.info('cy', cy);

        this._valueFontSize = parseInt(Math.min(canvasSize / 4, 100) * ((this._valueText != null) ? this._getFontScale(this._valueText.length) : 1)); //27;
        // console.info('this._valueText', this._valueText);
        // console.info('FontScale', this._getFontScale(this._valueText.length));

        // console.info('_valueFontSize', this._valueFontSize);

        return {
            "width": width,
            "canvasSize": canvasSize,
            "radius": radius,
            "cx": cx,
            "cy": cy
        }
    }

  


    // static UNIT_AUTO = 0;
    // static UNIT_STATIC = 1;

    // _init() {
    //     super._init();

    //     this._refresh_frame = null;
    //     this._chart_container = null;
    //     this._canvas = null;
    //     this._chart_color = null;
    //     this._min = null;
    //     this._max = null;
    //     this._value = null;
    //     this._last_value = null;
    //     this._units = '';
    // }

    // _processUpdateResponse(response) {
    //     if (response.history === null) {
    //         this._value = null;
    //         this._units = '';
    //     }
    //     else {
    //         this._value = Number(response.history.value);
    //  //       this._units = response.fields_values.value_units == WidgetLessonGaugeChart.UNIT_AUTO
    //    //         ? response.history.units
    //      //       : response.fields_values.value_static_units;
    //         this._units = response.history.units;
    //     }
    //     console.info(response);

    //     this._chart_color = 'FF0000'; //response.fields_values.color;
    //     this._min = 1; // Number(response.fields_values.min);
    //     this._max = 100; //Number(response.fields_values.max);

    //     if (this._canvas === null) {
    //         console.info('Canvas inexistant');
    //         super._processUpdateResponse(response);

    //         this._chart_container = this._content_body.querySelector('.chart');
    //         this._canvas = document.createElement('canvas');

    //         this._chart_container.appendChild(this._canvas);

    //         this._resizeChart();
    //     }
    //     else {
    //         console.info('Canvas existant');
    //         this._updatedChart();
    //     }
    // }

    // resize() {
    //     super.resize();
    //     console.info('Canvas resize');

    //     if (this._state === WIDGET_STATE_ACTIVE) {
    //         this._resizeChart();
    //     }
    // }

    // _resizeChart() {
    //     console.info('Canvas resize chart');
    //     const ctx = this._canvas.getContext('2d');
    //     const dpr = window.devicePixelRatio;

    //     this._canvas.style.display = 'none';
    //     const size = Math.min(this._chart_container.offsetWidth, this._chart_container.offsetHeight);
    //     this._canvas.style.display = '';

    //     this._canvas.width = size * dpr;
    //     this._canvas.height = size * dpr;

    //     ctx.scale(dpr, dpr);

    //     this._canvas.style.width = `${size}px`;
    //     this._canvas.style.height = `${size}px`;

    //     this._refresh_frame = null;

    //     this._updatedChart();
    // }

    // _updatedChart() {
    //     console.info('Canvas updatechart');
    //     if (this._last_value === null) {
    //         this._last_value = this._min;
    //     }

    //     const start_time = Date.now();
    //     const end_time = start_time + 400;

    //     const animate = () => {
    //         const time = Date.now();

    //         if (time <= end_time) {
    //             const progress = (time - start_time) / (end_time - start_time);
    //             const smooth_progress = 0.5 + Math.sin(Math.PI * (progress - 0.5)) / 2;
    //             let value = this._value !== null ? this._value : this._min;
    //             value = (this._last_value + (value - this._last_value) * smooth_progress - this._min) / (this._max - this._min);

    //             const ctx = this._canvas.getContext('2d');
    //             const size = this._canvas.width;
    //             const char_weight = size / 12;
    //             const char_shadow = 3;
    //             const char_x = size / 2;
    //             const char_y = size / 2;
    //             const char_radius = (size - char_weight) / 2 - char_shadow;

    //             const font_ratio = 32 / 100;

    //             ctx.clearRect(0, 0, size, size);

    //             ctx.beginPath();
    //             ctx.shadowBlur = char_shadow;
    //             ctx.shadowColor = '#bbb';
    //             ctx.strokeStyle = '#eee';
    //             ctx.lineWidth = char_weight;
    //             ctx.lineCap = 'round';
    //             ctx.arc(char_x, char_y, char_radius, Math.PI * 0.749, Math.PI * 2.251, false);
    //             ctx.stroke();

    //             ctx.beginPath();
    //             ctx.strokeStyle = `#${this._chart_color}`;
    //             ctx.lineWidth = char_weight - 2;
    //             ctx.lineCap = 'round';
    //             ctx.arc(char_x, char_y, char_radius, Math.PI * 0.75,
    //                 Math.PI * (0.75 + (1.5 * Math.min(1, Math.max(0, value)))), false
    //                 );
    //             ctx.stroke();

    //             ctx.shadowBlur = 2;
    //             ctx.fillStyle = '#1f2c33';
    //             ctx.font = `${(char_radius * font_ratio)|0}px Arial`;
    //             ctx.textAlign = 'center';
    //             ctx.textBaseline = 'middle';
    //             ctx.fillText(`${this._value !== null ? this._value : t('No data')}${this._units}`,
    //                 char_x, char_y, size - char_shadow * 4 - char_weight * 2
    //             );

    //             ctx.fillStyle = '#768d99';
    //             ctx.font = `${(char_radius * font_ratio * .5)|0}px Arial`;
    //             ctx.textBaseline = 'top';

    //             ctx.textAlign = 'left';
    //             ctx.fillText(`${this._min}${this._min != '' ? this._units : ''}`,
    //                 char_weight * .75, size - char_weight * 1.25, size / 2 - char_weight
    //             );

    //             ctx.textAlign = 'right';
    //             ctx.fillText(`${this._max}${this._max != '' ? this._units : ''}`,
    //                 size - char_weight * .75, size - char_weight * 1.25, size / 2 - char_weight
    //             );

    //             requestAnimationFrame(animate);
    //         }
    //         else {
    //             this._last_value = this._value;
    //         }
    //     };

    //     requestAnimationFrame(animate);
    // }
}


/*    
    class CGauge extends CDiv {
    
        private $startAngle;
        private $endAngle;
    
        private $width;
        private $height;
    
        private $showThresholdMarkers;
        private $thresholdWidth;
        private $thresholdvalues;
        private $thresholdcolors;
    
        private $showValue;
        private $valueText;
        private $valueRaw;
        private $valueFontSize;
        private $valueMargin;
        private $valueMin;
        private $valueMax;
    
        public function __construct($options) {
            parent::__construct();
            
            $this->setId(uniqid());
    
            //Bientot déprécié
            if(!empty($options['elements_ex'])) {
                $elementsEx = json_decode($options['elements_ex']);
                $this->showValue = property_exists($elementsEx,'showValue') ? $elementsEx->showValue : true;
                $this->valueMax = property_exists($elementsEx,'valueMax') ? $elementsEx->valueMax : 100;
                $this->valueMin = property_exists($elementsEx,'valueMin') ? $elementsEx->valueMin : 0;
                $this->showTitle = property_exists($elementsEx,'showTitle') ? $elementsEx->showTitle : true;
                $this->showThresholdMarkers = property_exists($elementsEx,'showThresholdMarkers') ? $elementsEx->showThresholdMarkers : true;
                $this->title = property_exists($elementsEx,'title') ? $elementsEx->title : "Data";
                $this->thresholdValues = property_exists($elementsEx,'thresholdValues') ? $elementsEx->thresholdValues : "70, 90, 100";
                $this->thresholdColors = property_exists($elementsEx,'thresholdColors') ? $elementsEx->thresholdColors : "#009100, #DF8800, #E12C00";
            }
            else {
                list($showValue, $valueMin, $valueMax, $showTitle, $title, $showThresholdMarkers, $thresholdValues, $thresholdColors) = explode("|", $options['application'], 8);
    
                $this->showValue = $showValue;
                $this->valueMin = $valueMin;
                $this->valueMax = $valueMax;
        
                $this->showTitle = $showTitle;
                $this->title = $title;
        
                $this->showThresholdMarkers = $showThresholdMarkers;
                $this->thresholdValues = $thresholdValues;
                $this->thresholdColors = $thresholdColors;
            }
    
            $this->startAngle = 0.9;
            $this->endAngle = 2.1;
            $this->thresholdWidth = 5;
            $this->valueMargin = 5;
    
        }
    
    
        public function setWidth($value) {
            $this->width = $value;
    
            return $this;
        }
    
        public function setHeight($value) {
            $this->height = $value;
    
            return $this;
        }
    

    
        public function setValueRaw($value) {
            $this->valueRaw = $value;
    
            return $this;
        }
    

        

    

         

    
 

        private function getColor() {
            $values = explode(',', $this->thresholdValues);
            $colors = explode(',', $this->thresholdColors);
    
            for ($i = 0; $i < count($values) && array_key_exists($i,$colors); $i++) {
                $threshold = $values[$i];
                $color = $colors[$i];
                if ($this->valueRaw <= $threshold) break;
            }
            return $color;
        }    

       
    
    }
*/