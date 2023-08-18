class YrzEnhancer extends CWidget {

    _init() {
        super._init();

        this._configuration = null;
        this._container = null;
        this._style = null;
    }   

    _processUpdateResponse(response) {

        const fields = response.fields_values;

        this._configuration = {
            "enable":         fields.enable,
            "body": {
                "background": {
                    "color": this._default(fields.body_background_color, "2b2b2b"),
                }
            },
            "dashboard" : {
                "padding":    fields.dashboard_padding,
            },
            "widget": {
                "background": {
                    "color":  this._default(fields.widget_background_color, "transparent"),
                },
                "border": {
                    "color":  this._default(fields.widget_border_color, "transparent"),
                    "show":  fields.widget_border_show
                },
                "margin":    fields.widget_margin
            }
        }

        super._processUpdateResponse(response);
        this._container = this._content_body.querySelector('.yrzenhancer');

        this._processCss();
    }

    _default(value, defaultValue) {
        return (value == null || value == '' || value == undefined) ? defaultValue : value;
    }

    _getColor(color) {
        return (color == 'transparent') ? color : '#' + color;
    }

    _iterateStyles(rules) {
        var _ret = '';
        rules.forEach((_rule) => {
            Object.keys(_rule).forEach((_selector) => {
                const _values = _rule[_selector];

                _ret += _selector + ' {\n';
                if (Array.isArray(_values)) {;
                    _values.forEach((_value) => {
                        Object.keys(_value).forEach((_css) => {
                            _ret += '\t' + _css + ': ' + _value[_css] + ';\n';
                        });
                    });
                } else {
                    Object.keys(_values).forEach((_css) => {
                        _ret += '\t' + _css + ': ' + _values[_css] + ';\n';
                    });
                }

                _ret += '}\n';
            });
        });

        return _ret;
    }

    _processCss() {
        console.info(this._configuration);

        if (this._configuration.enable) {

            const _rules = [
                {
                    'body': {'background-color': this._getColor(this._configuration.body.background.color) },
                    'main': { 'padding': this._configuration.dashboard.padding + 'px' },
                    'div.dashboard-grid': [
                        { 'margin': '0' },
                        { 'padding': '0' }
                    ],
                    'div.dashboard-grid-widget-container': [
                        { 'margin': this._configuration.widget.margin + 'px' },
                        { 'border': (!this._configuration.widget.border.show) ? 'none' : '1px solid ' + this._getColor(this._configuration.widget.border.color) },
                        { 'padding': '0' }
                    ],
                    'div.dashboard-grid-widget-head': [
                        { 'background-color': this._getColor(this._configuration.widget.background.color) },
                        { 'border': 'none '},
                        { 'left': '0' },
                        { 'right': '0' },
                        { 'top': '0' }
                    ],
                    'div.dashboard-grid-widget-content': [
                        { 'background-color': this._getColor(this._configuration.widget.background.color) },
                        { 'border': 'none' }
                    ]
                }
            ];

            const _styles = this._iterateStyles(_rules);

            const _style = document.createElement('STYLE');
                _style.type= 'text/css';
                _style.media= 'screen';
                _style.appendChild(document.createTextNode(_styles));

            this._appendStyle(_style);
        } else {
            this._removeStyle();
        }
    }

    _appendStyle(style) {
        this._removeStyle();
        document.getElementsByTagName('HEAD')[0].appendChild(style);
        this._style = style;
    }

    _removeStyle() {
        if (this._style == null) return;
        document.getElementsByTagName('HEAD')[0].removeChild(this._style);
        this._style = null;
    }
}