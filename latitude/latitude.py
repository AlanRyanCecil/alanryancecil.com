from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

latitude = Blueprint('latitude', __name__,
                     template_folder='latitude_templates', static_folder='latitude_static')


@latitude.route('/latitude')
def show():
    try:
        return render_template('latitude_index.html')
    except TemplateNotFound:
        abort(404)


@latitude.route('/latitude-<page>')
def temp(page):
    try:
        return render_template('{}.html'.format(page))
    except TemplateNotFound:
        abort(404)
