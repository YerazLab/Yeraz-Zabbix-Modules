class YrzHtml extends CWidget {

    _init() {
        super._init();

        this._configuration = null;
        this._container = null;
    }   

    _processUpdateResponse(response) {

        const fields = response.fields_values;

        this._configuration = {
            "html":        fields.html
        }

        super._processUpdateResponse(response);
        this._container = this._content_body.querySelector('.yrzhtml');
    }
}
