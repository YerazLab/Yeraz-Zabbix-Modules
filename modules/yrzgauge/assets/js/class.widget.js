class YrzGauge extends CWidget {

    _init() {
        super._init();

        this._configuration = null;
        this._container = null;
        this._svg = null;
        this._layout = null;

        this._units = null;
        this._value = null;
        this._valueText = null;
    }   

    _processUpdateResponse(response) {

        console.info(response);

        this._configuration = {
            "angles": {
                "start": this._toRad(162),
                "end": this._toRad(378)
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
                "width": response.fields_values.threshold_width,
                "space": response.fields_values.threshold_space
            },
            "padding": response.fields_values.padding,
            "color": {
                "gauge": response.fields_values.gauge_color,
                "value": response.fields_values.value_color
            },
            "decimals_select": response.fields_values.decimals_select,
            "decimals_value": response.fields_values.decimals_value,
            "showTitle": response.fields_values.show_title,
            "showValue": response.fields_values.show_value,
            "thickness_select": response.fields_values.thickness_select,
            "thickness_value": response.fields_values.thickness_value,
            "title_text_size_select": response.fields_values.title_text_size_select,
            "title_text_size_value": response.fields_values.title_text_size_value,
            "units_select": response.fields_values.units_select,
            "units_value": response.fields_values.units_value,
            "value_text_size_select": response.fields_values.value_text_size_select,
            "value_text_size_value": response.fields_values.value_text_size_value,
            "title": response.name
        }        

        if (response.history === null) {
            this._units = null;
            this._value = null;
            this._valueText = null;
        }
        else {
            this._units = response.history.units;
            this._value = parseInt(response.history.value);
            this._valueText = this._getValueText(response.history.value);
        }

        if (this._svg === null) {
            super._processUpdateResponse(response);
            this._container = this._content_body.getElementsByTagName('div')[0];
        }

        this._resize();
    }

    _removeSVG() {
        if (this._svg == null) return;

        this._container.removeChild(this._svg);
        this._svg == null;
    }

    _appendSVG() {
        this._removeSVG();

        var _style = window.getComputedStyle(this._container);

        const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              _svg.setAttribute("width", parseInt(_style.getPropertyValue("width")));
              _svg.setAttribute("height", parseInt(_style.getPropertyValue("height")));

        this._container.appendChild(_svg);
        this._svg = _svg;
    }

    _resize() {
        super.resize();

        console.info('Resize');

        this._appendSVG();

        this._layout = this._calculLayout();

        this._drawTitle();
        this._drawValue();
        this._drawThresholds();

        const _space = this._configuration.thresholds.items.length ? this._configuration.thresholds.space : 0
        const _width = this._configuration.thickness_select == 0 ? this._layout.width : this._configuration.thickness_value;

        this._drawArc(
            this._layout.x, 
            this._layout.y, 
            this._layout.radius - _space, 
            _width, 
            this._configuration.angles.start, 
            this._configuration.angles.end, 
            null, 
            'FFFFFF',
            'yrzgauge-gauge'
        );

        this._drawArc(
            this._layout.x, 
            this._layout.y, 
            this._layout.radius - _space, 
            _width, 
            this._configuration.angles.start, 
            this._calculateAngle(this._value), 
            null, 
            this._getColor(),
            'yrzgauge-gauge-value'
        );
    }     

    _getSVGText(text, x, y, fontSize, className) {
        const el = document.createElementNS("http://www.w3.org/2000/svg","text");
              el.setAttributeNS(null,"x", x);     
              el.setAttributeNS(null,"y", y);
              el.setAttributeNS(null,"font-size", fontSize); 
              el.setAttribute('class', className);
              el.innerHTML = text;

        this._svg.appendChild(el);
    }

    _getValueText(value) {
        if (value == null) return "-";

        const _decimals = this._configuration.decimals_select == 0 ? 0 : this._configuration.decimals_value;
        const _units = this._configuration.units_select == 0 ? this._units : this._configuration.units_value;

        return parseFloat(value).toFixed(_decimals) + _units;    

    }

    _drawTitle() {
        if (!this._configuration.showTitle || this._configuration.title == null) return;

        var _fontSize = this._container.clientHeight * (12 / 100 / 1.14);
        
        if (this._configuration.title_text_size_select == 1) _fontSize = this._configuration.title_text_size_value;

        this._getSVGText(
            this._configuration.title,
            this._layout.gaugeSize /2,
            12,
            _fontSize,
            'yrzgauge-title'
        );
    }

    _drawValue() {
        if (!this._configuration.showValue) return;

        var _fontSize = this._container.clientHeight * (18 / 100 / 1.14);

        this._getSVGText(
            this._valueText,
            this._layout.gaugeSize /2,
            5 * this._layout.gaugeSize /8,
            _fontSize,
            'yrzgauge-value'
        );
    }

    _getSVGArc(x, y, radius, startAngle, endAngle, counterClockwise) {
        const _start = this._polarToCartesian(x, y, radius, endAngle);
        const _end   = this._polarToCartesian(x, y, radius, startAngle);

        const _largeArcFlag = Math.abs(endAngle - startAngle) <= Math.PI ? 0 : 1;

        return [
            "M", _start.x, _start.y,
            "A", radius, radius, 0, _largeArcFlag, counterClockwise ? 1 : 0, _end.x, _end.y
        ].join(" ");
    }  
    
    _getSVGLine(x, y) {
        return [
            "L", x , y
        ].join(" ");
    }

    _drawArc(x, y, radius, width, startAngle, endAngle, strokeWidth = null, fillStyle = null, className) {

        if (startAngle == endAngle) return;

        const _origin = this._polarToCartesian(x, y, radius, endAngle);

        const _d = [
            this._getSVGArc(x, y,
                radius,
                endAngle,
                startAngle,
                1
            ),
            this._getSVGLine(
                x + (radius - width) * Math.cos(startAngle), 
                y + (radius - width) * Math.sin(startAngle)
            ),
            this._getSVGArc(x, y,
                radius - width,
                startAngle,
                endAngle,
                0    
            ),
            this._getSVGLine(
                _origin.x,
                _origin.y
            )
        ];

        const el = document.createElementNS("http://www.w3.org/2000/svg","path");
              el.setAttributeNS(null,"d", _d.join(" "));
              el.setAttribute('class', className);

            if (strokeWidth != null) el.setAttribute('stroke-width', strokeWidth);
            if (fillStyle != null) el.setAttribute('fill', '#' + fillStyle);
      
        this._svg.appendChild(el);
    }

    _getColor() {
        var _color = this._configuration.color.value;

        if (!this._configuration.thresholds.items.length) return _color;

        for (var i = 0; i < this._configuration.thresholds.items.length; i++) {
            if (this._value >= this._configuration.thresholds.items[i].threshold) {
                _color = this._configuration.thresholds.items[i].color;
            }
        }

        return _color;
    }    

    _drawThresholds() {
        if (!this._configuration.thresholds.items.length) return;

        var _angleFrom = this._configuration.angles.start;

        this._configuration.thresholds.items.unshift({
            color: this._configuration.color.value,
            threshold: 0
        });

        for (var _i = 0; _i < this._configuration.thresholds.items.length; _i++) {

            const _color = this._configuration.thresholds.items[_i].color;
            var _angleTo = this._configuration.angles.end;

            if (_i < this._configuration.thresholds.items.length -1) {
                var _threshold = this._configuration.thresholds.items[_i+1].threshold;
                _angleTo = this._calculateAngle(_threshold);
            }

            this._drawArc(
                this._layout.x,
                this._layout.y,
                this._layout.radius + this._configuration.thresholds.width,
                this._configuration.thresholds.width,
                _angleFrom,
                _angleTo,
                null,
                _color
            );

            _angleFrom = _angleTo;
        }
    }

    _calculateAngle(value) {
        var _angle =
            this._configuration.angles.start
                + (this._configuration.angles.end - this._configuration.angles.start)
                    * ((value - this._configuration.limits.min) / (this._configuration.limits.max - this._configuration.limits.min));

        if (_angle < this._configuration.angles.start) {
            _angle = this._configuration.angles.start;
        } else if (_angle > this._configuration.angles.end) {
            _angle = this._configuration.angles.end;
        }
        return _angle;        
    }

    _polarToCartesian(x, y, radius, angle) {
        return {
            "x": (x + radius * Math.cos(angle)),
            "y": (y + radius * Math.sin(angle))
        }
    }    

    _toRad(angle) {
        // return angle * Math.PI;
        return angle * (Math.PI / 180);
    }

    _calculLayout() {

        const _svgSize = this._svg.getBoundingClientRect();
        const _gaugeSize = Math.min(_svgSize.width, _svgSize.height);
        const _thresholdWidth = (this._configuration.thresholds.items.length > 0) ? this._configuration.thresholds.width : 0;
        const _maxRadiusH = (_gaugeSize / 2) - _thresholdWidth;
        const _angle = ((this._configuration.angles.end - this._configuration.angles.start) / 100);

        var _heightRatioV = -1;

        for (var _i = this._configuration.angles.start; _i < this._configuration.angles.end; _i += _angle) {
            _heightRatioV = Math.max(_heightRatioV, Math.sin(_i));
        }

        _heightRatioV = Math.max(_heightRatioV, Math.sin(this._configuration.angles.end));

        var _outerRadiusV = _svgSize.height / (1 + _heightRatioV);

   //     if (_outerRadiusV * _heightRatioV < this._configuration.margin + (this._valueFontSize / 2))
    //        _outerRadiusV = _gaugeSize - this._configuration.margin - (this._valueFontSize / 2);

        const _maxRadiusV = _outerRadiusV - _thresholdWidth;
        var _radius = Math.min(_maxRadiusH, _maxRadiusV);

        var _width = _gaugeSize;
        if (_width >= _radius) _width = Math.max(3, _radius / 3);

        const _outerRadius = _thresholdWidth + _radius;

 //       const _gaugeOuterHeight = Math.max(_outerRadius * (1 + _heightRatioV), _outerRadius + this._configuration.margin + (this._valueFontSize / 2));
        const _gaugeOuterHeight = Math.max(_outerRadius * (1 + _heightRatioV), _outerRadius);

        var _x = _gaugeSize / 2;
        var _y = _thresholdWidth + _radius;

        const _blank = _svgSize.height - _gaugeOuterHeight;
        const _offsetY = (_blank / 2);

        _y += _offsetY;

        return {
            "width": _width,
            "gaugeSize": _gaugeSize,
            "radius": _radius,
            "x": _x,
            "y": _y
        }
    }
}
