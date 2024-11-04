from flask import Flask, jsonify, request
from flask_cors import CORS

# Import/pass database functions for/as a Flask API.
# OR rewrite with flask?
# HTTPS security?
# API is clunky :(
# New functions :(

from .databasefunctions import (
    connect_db,
    create_passwords_table,
    add_password_entry,
    get_password,
    update_password_entry,
    delete_password,
    update_username
)

app = Flask(__name__)

@app.route('/api/passwords', methods=['POST'])
def create():
  # TODO
  return

# CRUD

@app.route('/api/passwords/entry', methods=['POST'])
def add():
  username = request.get.args('username', type=str)
  url = request.get.args('url', type=str)
  password = request.get.args('password', type=str)
  
  if username is None or url is None or password is None:
    return jsonify({"error:": "Missing parameter"}), 400
  
  add_password_entry(username, url, password)

@app.route('/api/passwords/entry', methods=['GET'])
def get():
  username = request.get.args('username', type=str)
  url = request.get.args('url', type=str)

  if username is None or url:
    return jsonify({"error:": "Missing parameter"}), 400

  get_password(username, url)

@app.route('/api/passwords/entry/password', methods=['PATCH'])
def update_password():
  username = request.get.args('username', type=str)
  url = request.get.args('url', type=str)
  new_password = request.get.args('new_password', type=str)

  if username is None or url is None or new_password is None:
    return jsonify({"error:": "Missing parameter"}), 400

  update_password_entry(username, url, new_password)

@app.route('/api/passwords/entry', methods=['DELETE'])
def delete():
  username = request.get.args('username', type=str)
  url = request.get.args('url', type=str)
  
  if username is None or url:
    return jsonify({"error:": "Missing parameter"}), 400
  
  delete_password(username, url)

@app.route('/api/usernames/entry/username', methods=['PATCH'])
def update_username():
  new_username = request.get.args('new_username', type=str)
  old_username = request.get.args('old_username', type=str)
  url = request.get.args('url', type=str)

  if new_username is None or old_username is None or url is None:
    return jsonify({"error:": "Missing parameter"}), 400

  update_username(new_username, old_username, url)

if __name__ == '__main__':
  app.run(port=5000)