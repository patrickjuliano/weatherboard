from my_app import app

@app.route("/", methods=["GET"])
def hello_world():
    return "Hello world, this is flask"

    