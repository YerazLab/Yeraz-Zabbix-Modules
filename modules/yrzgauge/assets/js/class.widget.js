class YrzGauge extends CWidget {

    _init() {
        super._init();

        this._configuration = null;
        this._container = null;
        this._svg = null;
        this._layout = null;
        this._units = null;
        this._history = [];
        this._angles = {};
    }   

    _processUpdateResponse(response) {

        this._configuration = {
            "thresholds": {
                "items": response.fields_values.thresholds,
                "width": response.fields_values.threshold_width,
                "space": response.fields_values.threshold_space
            },
            "show": {
                "title":   response.fields_values.show_title,
                "value":   response.fields_values.show_value,
                "markers": response.fields_values.show_markers,
            },
            "angle": response.fields_values.angle,
            "colors": {
                "base": response.fields_values.base_color,
                "background": response.fields_values.background_color,
                "title": response.fields_values.title_color,
            },
            "decimals" : {
                "select": response.fields_values.decimals_select,
                "value":  response.fields_values.decimals_value,
            },
            "thickness": {
                "select": response.fields_values.thickness_select,
                "value":  response.fields_values.thickness_value,
            },
            "units" :{
                "select": response.fields_values.units_select,
                "value":  response.fields_values.units_value,
            },
            "title": response.name
        }        

        if (response.history === null) {
            this._units = null;
            this._history = [];
        }
        else {
            this._units = response.units;
            this._history = response.history;
        }

        this._getAngles();

        if (this._svg === null) {
            super._processUpdateResponse(response);
            this._container = this._content_body.querySelector('.yrzgauge');
        }

        this.resize();
    }

    _removeSVG() {
        if (this._svg == null) return;

        this._container.removeChild(this._svg);
        this._svg == null;
    }

    _getAngles() {
        var _from = 162;
        var _to = 378;

        switch (this._configuration.angle) {
            case 0:
                _from = 180; 
                _to = 360;
                break;
            case 2:
                _from = 140; 
                _to = 400;
                break;
            case 3:
                _from = 180; 
                _to = 539.9;
                break;
        }

        this._angles = {
            "start": this._toRad(_from),
            "end": this._toRad(_to)
        }
    }

    _appendSVG() {
        this._removeSVG();

        const _containerStyle = window.getComputedStyle(this._container);

        const _title = this._container.querySelector('.yrzgauge-title');
        const _titleBound = _title.getBoundingClientRect();
        const _titleStyle = window.getComputedStyle(_title);

        const _size = Math.min(
            parseInt(_containerStyle.getPropertyValue("width")), 
            parseInt(_containerStyle.getPropertyValue("height")) - parseInt(_titleBound.height) - parseInt(_titleStyle.marginBottom)
        );

        const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              _svg.setAttribute("width", _size);
              _svg.setAttribute("height", _size);
              _svg.setAttribute('class', 'yrzgauge-gauge');


        this._container.style.setProperty(
            '--content-height', _containerStyle.getPropertyValue("height")
        );

        this._container.appendChild(_svg);
        this._svg = _svg;
    }

    resize() {
        super.resize();

        this._appendSVG();

        this._layout = this._calculLayout();

        this._drawTitle();
        this._drawValue();
        this._drawThresholds();

        const _space = this._configuration.show.markers ? this._configuration.thresholds.space : 0
        const _width = this._configuration.thickness.select == 0 ? this._layout.width : this._configuration.thickness.value;

        this._drawArc(
            this._layout.x, 
            this._layout.y, 
            this._layout.radius - _space, 
            _width, 
            this._angles.start, 
            this._angles.end, 
            this._configuration.colors.background,
            'yrzgauge-gauge-track'
        );

        this._drawArc(
            this._layout.x, 
            this._layout.y, 
            this._layout.radius - _space, 
            _width, 
            this._angles.start, 
            this._calculateAngle(this._getValue()), 
            this._getColor(),
            'yrzgauge-gauge-value'
        );

        if (this._state === WIDGET_STATE_ACTIVE) {
            this._startUpdating();
        }
    }

    _getValue() {
        if (!this._history.length) return null;
        return this._history[0].value;
    }

    _getValueText(value) {
        if (value == null) return "-";

        const _decimals = this._configuration.decimals.select == 0 ? 0 : this._configuration.decimals.value;
        const _units = this._configuration.units.select == 0 ? this._units : this._configuration.units.value;

        return parseFloat(value).toFixed(_decimals) + "<span>" + _units + "</span>";    

    }

    _drawTitle() {
        const _title = this._container.querySelector('.yrzgauge-title');

        _title.style.display = (!this._configuration.show.title || this._configuration.title == null) ? 'none' : 'block';
        _title.style.color = '#' + this._configuration.colors.title;
        _title.innerHTML = this._configuration.title;

        if (this._configuration.angle != 3) {
            _title.style.marginBottom = 0;
        }
    }

    _drawValue() {
        const _value = this._container.querySelector('.yrzgauge-value');

        _value.innerHTML = this._getValueText(this._getValue());
        _value.style.display = (!this._configuration.show.value) ? 'none' : 'block';
        _value.style.color = '#' + this._getColor();

        const _styleContainer = window.getComputedStyle(this._container);
        const _styleValue = window.getComputedStyle(_value);
        const _containerBound = this._container.getBoundingClientRect();
        const _svgBound = this._svg.getBoundingClientRect();
        const _title = this._container.querySelector('.yrzgauge-title');
        const _titleStyle = window.getComputedStyle(_title);

        var _top = this._layout.y + ((this._layout.radius - this._layout.width) * Math.sin(this._angles.start)) +
                   parseInt(_styleContainer.paddingTop) -
                   parseInt(_styleValue.height) -
                   parseInt(_titleStyle.marginBottom) +
                   (_svgBound.top - _containerBound.top);

        if (this._configuration.angle == 3) {
            _top = (_svgBound.top - _containerBound.top) +
                   (parseInt(_svgBound.height) / 2) -
                   (parseInt(_styleValue.height) / 2);
        }

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

    _drawArc(x, y, radius, width, startAngle, endAngle, fillStyle = null, className) {

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

            if (fillStyle != null) el.setAttribute('fill', '#' + fillStyle);
      
        this._svg.appendChild(el);
    }

    _getColor() {
        var _color = this._configuration.colors.base;

        for (var i = 0; i < this._configuration.thresholds.items.length; i++) {
            if (this._getValue() >= this._configuration.thresholds.items[i].threshold) {
                _color = this._configuration.thresholds.items[i].color;
            }
        }

        return _color;
    }    

    _drawThresholds() {
        if (!this._configuration.show.markers) return;

        var _angleFrom = this._angles.start;

        this._configuration.thresholds.items.unshift({
            color: this._configuration.colors.base,
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
                _color,
                'yrzgauge-gauge-threshold'
            );

            _angleFrom = _angleTo;
        }
    }

    _calculateAngle(value) {
        const _min = 0;
        const _max = 100;

        var _angle =
            this._angles.start
                + (this._angles.end - this._angles.start)
                    * ((value - _min) / (_max - _min));

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
        return angle * (Math.PI / 180);
    }

    _calculLayout() {

        const _svgBound = this._svg.getBoundingClientRect();
        const _gaugeSize = Math.min(_svgBound.width, _svgBound.height);
        const _thresholdWidth = (this._configuration.show.markers) ? this._configuration.thresholds.width : 0;
        const _maxRadiusH = (_gaugeSize / 2) - _thresholdWidth;
        const _angle = ((this._angles.end - this._angles.start) / 100);

        var _heightRatioV = -1;

        for (var _i = this._angles.start; _i < this._angles.end; _i += _angle) {
            _heightRatioV = Math.max(_heightRatioV, Math.sin(_i));
        }

        _heightRatioV = Math.max(_heightRatioV, Math.sin(this._angles.end));

        var _outerRadiusV = _svgBound.height / (1 + _heightRatioV);

        const _maxRadiusV = _outerRadiusV - _thresholdWidth;
        var _radius = Math.min(_maxRadiusH, _maxRadiusV);

        var _width = _gaugeSize;
        if (_width >= _radius) _width = Math.max(3, _radius / 3);

        const _outerRadius = _thresholdWidth + _radius;
        const _gaugeOuterHeight = Math.max(_outerRadius * (1 + _heightRatioV), _outerRadius);

        var _x = _gaugeSize / 2;
        var _y = _thresholdWidth + _radius;

        const _blank = _svgBound.height - _gaugeOuterHeight;
        const _offsetY = (_blank / 2);

        _y += _offsetY;

        return {
            "width": _width,
            "radius": _radius,
            "x": _x,
            "y": _y
        }
    }
}
