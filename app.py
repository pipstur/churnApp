# app.py

from flask import Flask, request, jsonify
from clustering_module import perform_clustering  
from flask_cors import CORS 
import json


app = Flask(__name__)
CORS(app,
     resources={
       r"/cluster": {
         "origins": ["http://localhost:8000", "https://pipstur.github.io"]
       }
     })

@app.route('/cluster', methods=['POST'])
def cluster_data():
    data = request.form['file']  # Access data from form data
    # Convert the JSON data to a Python dictionary
    data_dict = json.loads(data)

     # Clustering
    result = perform_clustering(data_dict)
    return jsonify({'result': result})


if __name__ == '__main__':
    app.run()
