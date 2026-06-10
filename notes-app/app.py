from flask import Flask,render_template, redirect
from routes.auth import auth
from routes.notes import notes

app = Flask(__name__)

app.secret_key = 'fhvhhhehknhw12454882'

app.register_blueprint(auth)
app.register_blueprint(notes)

@app.route("/")
def default():
    return redirect("/login")

@app.route("/login")
def home():
    return render_template("index.html")
if __name__ == '__main__':
    app.run(debug = True)
