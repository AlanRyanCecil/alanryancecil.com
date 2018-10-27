from flask import Flask, request, url_for, redirect, render_template

from latitude.latitude import latitude
from mars.mars import mars
from aliens.aliens import aliens
from health.health import health
from tictactoe.tictactoe import tictactoe
from malaria.malaria import malaria
# from belly.belly import belly

app = Flask(__name__)

app.register_blueprint(latitude)
app.register_blueprint(aliens)
app.register_blueprint(mars)
app.register_blueprint(health)
app.register_blueprint(tictactoe)
app.register_blueprint(malaria)
# app.register_blueprint(belly)

@app.route('/')
def landing():
    return render_template('index.html')


@app.route('/idx')
def index():
    projects = request.args.get('projects')
    return render_template('index.html', projects=projects)


@app.route('/projects', methods=['POST'])
def projects():
    if request.method == 'POST':
        projects = request.get_json()
        return redirect(url_for('index', projects=projects), code=302)


if __name__ == "__main__":
    app.run(debug=True)
