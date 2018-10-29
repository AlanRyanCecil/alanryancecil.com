from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

tictactoe = Blueprint('tictactoe', __name__,
                      template_folder='tic_templates',
                      static_folder='tic_static')


@tictactoe.route('/tictactoe')
def show():
    try:
        return render_template('tictactoe.html')
    except TemplateNotFound:
        abort(404)
