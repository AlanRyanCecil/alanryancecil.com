from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

aliens = Blueprint('aliens', __name__,
                   template_folder='alien_templates', static_folder='alien_static')


@aliens.route('/aliens')
def show():
    try:
        return render_template('alien_index.html')
    except TemplateNotFound:
        abort(404)
