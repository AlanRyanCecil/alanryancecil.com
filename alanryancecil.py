from flask import Flask, render_template
app = Flask(__name__)


@app.route("/")
def hello():
    return render_template('index.html')

if __name__ == "__main__":
    print('yes this code ran on the server')
    # app.run()
    app.run(host='0.0.0.0')
