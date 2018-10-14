from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

health = Blueprint('health', __name__,
                template_folder='health_templates', static_folder='health_static')


@health.route('/health')
def show():
    try:
        return render_template('health.html')
    except TemplateNotFound:
        abort(404)
