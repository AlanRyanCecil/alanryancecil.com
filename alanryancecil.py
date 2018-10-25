from flask import Flask, render_template

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
def hello():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
