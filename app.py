from flask import Flask
from flask import render_template

app = Flask(__name__, template_folder='templates')


@app.route("/")
def hello_world():
    return "Hi!"


if __name__ == '__main__':
    app.run()
