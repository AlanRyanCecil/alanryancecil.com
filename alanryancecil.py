from flask import Flask, render_template

from latitude.latitude import latitude
from mars.mars import mars
from aliens.aliens import aliens

app = Flask(__name__)

app.register_blueprint(latitude)
app.register_blueprint(aliens)
app.register_blueprint(mars)


@app.route('/')
def hello():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
