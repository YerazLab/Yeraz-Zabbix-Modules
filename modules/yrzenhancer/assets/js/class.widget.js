class YrzEnhancer extends CWidget {

    _init() {
        super._init();

        this._configuration = null;
        this._style = null;
    }   

    _setMode(edit) {
        this._content_body.parentNode.style.display = (edit == true) ? 'block' : 'none';
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
                "padding": fields.dashboard_padding,
            },
            "widget": {
                "background": {
                    "color": this._default(fields.widget_background_color, "transparent"),
                },
                "border": {
                    "color": this._default(fields.widget_border_color, "transparent"),
                    "show": fields.widget_border_show
                },
                "margin": fields.widget_margin
            }
        }

        super._processUpdateResponse(response);

        this._setMode(this._is_edit_mode);

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

        const _container = this._content_body.parentNode;

        const _divs = _container.querySelectorAll('div');

        _container.style.border = 'none';
        _divs[0].style.backgroundColor = "#6C353A";
        _divs[1].style.backgroundColor = "#B63F4B";

        const _buttonEdit = _container.querySelector('.btn-widget-edit');
              _buttonEdit.style.background = 'none';
              _buttonEdit.style.marginTop = '4px';
              _buttonEdit.innerHTML = this._getEditSVG();

        const _buttonAction = _container.querySelector('.btn-widget-action');
              _buttonAction.style.background = 'none';
              _buttonAction.style.marginTop = '4px';
              _buttonAction.innerHTML = this._getActionSVG();
    }

    _getEditSVG() {
        return '<svg viewBox="0 0 18 18" fill="#FFFFFF" width="18" height="18" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"><path d="m14.748 7.854 2.123-.531a7.973 7.973 0 0 0-1.12-2.694L13.88 5.75l-1.628-1.628 1.122-1.87a7.997 7.997 0 0 0-2.695-1.121l-.53 2.123h-2.3L7.32 1.13a8.016 8.016 0 0 0-2.696 1.12l1.122 1.87L4.12 5.749 2.25 4.625a7.945 7.945 0 0 0-1.12 2.697l2.12.53v2.3l-2.12.53a7.944 7.944 0 0 0 1.119 2.695l1.871-1.122 1.626 1.626-1.122 1.87c.81.528 1.718.914 2.695 1.12l.53-2.12h2.3l.53 2.122a7.92 7.92 0 0 0 2.695-1.121l-1.123-1.87 1.627-1.626 1.871 1.122a8.001 8.001 0 0 0 1.121-2.694l-2.123-.53v-2.3h.001ZM9 11.302a2.299 2.299 0 1 1 0-4.599c1.27 0 2.3 1.028 2.3 2.3 0 1.272-1.03 2.3-2.3 2.3Z" fill-rule="nonzero"/></svg>';
    }

    _getActionSVG() {
        return '<svg viewBox="0 0 18 18" fill="#FFFFFF" width="18" height="18" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"><path d="M15.747 6.752a2.25 2.25 0 1 0 .001 4.5 2.25 2.25 0 0 0-.001-4.5Zm-13.494 0a2.25 2.25 0 1 0 .002 4.5 2.25 2.25 0 0 0-.002-4.5Zm6.747 0a2.25 2.25 0 1 0 .002 4.5A2.25 2.25 0 0 0 9 6.752Z" fill-rule="nonzero"/></svg>';
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

    setEditMode() {
        super.setEditMode();
        this._setMode(this._is_edit_mode);
    }
}