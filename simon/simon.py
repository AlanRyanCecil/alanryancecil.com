from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

simon = Blueprint('simon', __name__,
                  template_folder='simon_templates',
                  static_folder='simon_static')


@simon.route('/simon')
def show():
    try:
        return render_template('simon_index.html')
    except TemplateNotFound:
        abort(404)
