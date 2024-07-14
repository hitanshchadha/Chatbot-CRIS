from flask import Flask, render_template, jsonify, request
from chat import get_response
import pandas as pd


app = Flask(__name__)

@app.get('/')
def index_get():
    return render_template('base.html')

@app.post('/predict')
def predict():
    text = request.get_json().get('message')
    respone = get_response(text)
    message = {'answer': respone}
    return jsonify(message)

if __name__ == '__main__':
    app.run(debug=True)