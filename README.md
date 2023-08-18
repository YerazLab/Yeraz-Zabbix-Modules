# Yeraz Zabbix Modules

A bunch of custom Zabbix modules.

# Notes

This modules has only tested with Zabbix 6.4.

# Gauge

A very simple gauge widget with a grafana look and feel, needle and a lot of cool settings.

<img src="ressources/readme/gauges.png" width="250" style="margin-bottom:20px" />


# Dashboard Enhancer

Change dashboard settings like padding, margin and colors. Check the gif below (don't see the gif? wait, it's not loaded yet!)

<img src="ressources/readme/enhanced.gif" width="500" style="margin-bottom:20px" />

# HTML (WIP)

A simple but missing widget in Zabbix to display an HTML code (a simple code like a H1 or a complex structure) on the dashboard.


# Installation

* Copy only the each module folder (ex. **[yrzgauge](modules/)**) in your Zabbix modules directory (/usr/local/zabbix/modules)
* Go to the menu **Administration / General / Modules**
* Click on the button **Scan Directory** on the top right
* Click on the link **enabled** on the right of the module you added

Now you can use the widget in your dashboard.