class YrzGauge extends CWidget {

    _init() {
        super._init();

        this._configuration = null;
        this._container = null;
        this._svg = null;
        this._layout = null;
        this._angles = {};

        this._units = null;
        this._value = null;
    }   

    _processUpdateResponse(response) {

        this._configuration = {
            "limits": { 
                // max_select: response.fields_values.max_select,
                "max": response.fields_values.max_value,
                // min_select: response.fields_values.min_select,
                "min": response.fields_values.min_value,
            },
            "thresholds": {
                "items": response.fields_values.thresholds,
                "width": response.fields_values.threshold_width,
                "space": response.fields_values.threshold_space
            },
            "show": {
                "title": response.fields_values.show_title,
                "value": response.fields_values.show_value,
                "markers": response.fields_values.show_markers,
            },
            "gaugeType": response.fields_values.gauge_type,
            "baseColor": response.fields_values.base_color,
            "decimalsSelect": response.fields_values.decimals_select,
            "decimalsValue": response.fields_values.decimals_value,
            "thicknessSelect": response.fields_values.thickness_select,
            "thicknessValue": response.fields_values.thickness_value,
            "unitsSelect": response.fields_values.units_select,
            "unitsValue": response.fields_values.units_value,
            "title": response.name
        }        

        if (response.history === null) {
            this._units = null;
            this._value = null;
        }
        else {
            this._units = response.history.units;
            this._value = response.history.value;
        }

        this._getAngles();

        if (this._svg === null) {
            super._processUpdateResponse(response);
            this._container = this._content_body.querySelector('.yrzgauge');
        }

        this._resize();
    }

    _removeSVG() {
        if (this._svg == null) return;

        this._container.removeChild(this._svg);
        this._svg == null;
    }

    _getAngles() {
        var _from = 162;
        var _to = 378;

        switch (this._configuration.gaugeType) {
            case 0:
                _from = 180; 
                _to = 360;
                break;
            case 1:
                _from = 140; 
                _to = 400;
                break;
            case 3:
                _from = 0; 
                _to = 359.9;
                break;
        }

        this._angles = {
            "start": this._toRad(_from),
            "end": this._toRad(_to)
        }
    }

    _appendSVG() {
        this._removeSVG();

        var _style = window.getComputedStyle(this._container);

        var _size = Math.min(
            parseInt(_style.getPropertyValue("width")), 
            parseInt(_style.getPropertyValue("height"))
        );

        const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              _svg.setAttribute("width", _size);
              _svg.setAttribute("height", _size);


        this._container.style.setProperty(
            '--content-height', _style.getPropertyValue("height")
        );

        this._container.appendChild(_svg);
        this._svg = _svg;
    }

    _resize() {
        super.resize();

        this._appendSVG();

        this._layout = this._calculLayout();

        this._drawTitle();
        this._drawValue();
        this._drawThresholds();

        const _space = this._configuration.show.markers ? this._configuration.thresholds.space : 0
        const _width = this._configuration.thicknessSelect == 0 ? this._layout.width : this._configuration.thicknessValue;

        this._drawArc(
            this._layout.x, 
            this._layout.y, 
            this._layout.radius - _space, 
            _width, 
            this._angles.start, 
            this._angles.end, 
            null, 
            'FFFFFF',
            'yrzgauge-gauge'
        );

        this._drawArc(
            this._layout.x, 
            this._layout.y, 
            this._layout.radius - _space, 
            _width, 
            this._angles.start, 
            this._calculateAngle(this._value), 
            null, 
            this._getColor(),
            'yrzgauge-gauge-value'
        );
    }     

    _getValueText(value) {
        if (value == null) return "-";

        const _decimals = this._configuration.decimalsSelect == 0 ? 0 : this._configuration.decimalsValue;
        const _units = this._configuration.unitsSelect == 0 ? this._units : this._configuration.unitsValue;

        return parseFloat(value).toFixed(_decimals) + _units;    

    }

    _drawTitle() {
        const _title = this._container.querySelector('.yrzgauge-title');

        _title.style.display = (!this._configuration.show.title || this._configuration.title == null) ? 'none' : 'block';
        _title.innerHTML = this._configuration.title;
    }

    _drawValue() {
        const _value = this._container.querySelector('.yrzgauge-value');

        _value.innerHTML = this._getValueText(this._value);
        _value.style.display = (!this._configuration.show.value) ? 'none' : 'block';
        _value.style.color = '#' + this._getColor();

        const _styleContainer = window.getComputedStyle(this._container);
        const _styleValue = window.getComputedStyle(_value);

        var _top = this._layout.y + ((this._layout.radius - this._layout.width) * Math.sin(this._angles.start)) +
                   parseInt(_styleContainer.paddingTop) -
                   parseInt(_styleValue.height);

        _value.style.top = parseInt(_top) + 'px';
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
        var _color = this._configuration.baseColor;

        for (var i = 0; i < this._configuration.thresholds.items.length; i++) {
            if (this._value >= this._configuration.thresholds.items[i].threshold) {
                _color = this._configuration.thresholds.items[i].color;
            }
        }

        return _color;
    }    

    _drawThresholds() {
        if (!this._configuration.show.markers) return;

        var _angleFrom = this._angles.start;

        this._configuration.thresholds.items.unshift({
            color: this._configuration.baseColor,
            threshold: 0
        });

        for (var _i = 0; _i < this._configuration.thresholds.items.length; _i++) {

            const _color = this._configuration.thresholds.items[_i].color;
            var _angleTo = this._angles.end;

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
            this._angles.start
                + (this._angles.end - this._angles.start)
                    * ((value - this._configuration.limits.min) / (this._configuration.limits.max - this._configuration.limits.min));

        if (_angle < this._angles.start) {
            _angle = this._angles.start;
        } else if (_angle > this._angles.end) {
            _angle = this._angles.end;
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
        const _thresholdWidth = (this._configuration.show.markers) ? this._configuration.thresholds.width : 0;
        const _maxRadiusH = (_gaugeSize / 2) - _thresholdWidth;
        const _angle = ((this._angles.end - this._angles.start) / 100);

        var _heightRatioV = -1;

        for (var _i = this._angles.start; _i < this._angles.end; _i += _angle) {
            _heightRatioV = Math.max(_heightRatioV, Math.sin(_i));
        }

        _heightRatioV = Math.max(_heightRatioV, Math.sin(this._angles.end));

        var _outerRadiusV = _svgSize.height / (1 + _heightRatioV);

        const _maxRadiusV = _outerRadiusV - _thresholdWidth;
        var _radius = Math.min(_maxRadiusH, _maxRadiusV);

        var _width = _gaugeSize;
        if (_width >= _radius) _width = Math.max(3, _radius / 3);

        const _outerRadius = _thresholdWidth + _radius;
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
