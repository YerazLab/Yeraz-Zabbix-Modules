# Yeraz Zabbix Modules

A bunch of custom Zabbix modules.

# Notes

This modules has only tested with Zabbix 6.4.

# Gauge

A very simple gauge widget with a grafana look and feel and a lot of settings.

<img src="ressources/readme/gauges.png" width="250"  />

## Theme

Unfortunately Zabbix dont give any option to retrieve the palette of the current theme. You can change the title and track color in the
[widget.css](assets/css/widget.css).

```
.yrzgauge-title {
    color: #FFFFFF; // ex. #3c5563 for the blue theme
    ...
}

.yrzgauge-gauge-track {
    fill: #383838; // ex. #ebebeb for the blue theme
}
```

# Installation

* Copy only the each module folder (ex. **yrzgauge**) in your Zabbix modules directory (/usr/local/zabbix/modules)
* Go to the menu **Administration / General / Modules**
* Click on the button **Scan Directory** on the top right
* Click on the link **enabled** on the right of the module you added

Now you can use the widget in your dashboard.
