from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

aliens = Blueprint('aliens', __name__,
                   template_folder='templates', static_folder='static/resource')


@aliens.route('/aliens')
def show():
    try:
        return render_template('aliens.html')
    except TemplateNotFound:
        abort(404)
