import json
from datetime import datetime, timedelta

from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='templates', static_folder='templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///requests.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    method = db.Column(db.String(10), nullable=False)  # Assuming HTTP methods like GET, POST, etc.
    ip = db.Column(db.String(15), nullable=False)  # Assuming IPv4 addresses
    headers = db.Column(db.Text, nullable=False)
    query_strings = db.Column(db.Text)
    raw_content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    endpoint = db.Column(db.Text)

@app.route('/', methods=['GET'])
def get_html():
    return render_template('index.html')

# @app.route('/validate', methods=['POST'])
# def validate_password():
#     password = request.form.get('password')
#     if password == 'test123':
#         return render_template('index.html')
#     else:
#         return "", 204  # No Content


@app.route('/get_requests/', defaults={'endpoint': None}, methods=['GET'])
@app.route('/get_requests/<endpoint>', methods=['GET'])
def get_requests(endpoint):
    endpoint_query_param = request.args.get('endpoint')
    endpoint = endpoint_query_param or endpoint
    requests = Request.query.all()

    request_data = []
    for item in requests:
        if endpoint and item.endpoint == endpoint:
            request_info = {
                'id': item.id,
                'method': item.method,
                'timestamp': item.timestamp.strftime('%Y-%m-%d %I:%M:%S %p')
            }
            request_data.append(request_info)
        elif not endpoint:
            request_info = {
                'id': item.id,
                'method': item.method,
                'timestamp': item.timestamp.strftime('%Y-%m-%d %I:%M:%S %p')
            }
            request_data.append(request_info)
    return jsonify(request_data)

@app.route('/get_request_details', methods=['GET'])
def get_request_details():
    request_id = request.args.get('id')
    if request_id:
        request_detail = Request.query.get(request_id)
        if request_detail:
            return jsonify({'id': request_detail.id, 'method': request_detail.method,
                            'ip': request_detail.ip, 'headers': request_detail.headers,
                            'query_strings': request_detail.query_strings, 'raw_content': request_detail.raw_content,
                            'timestamp': request_detail.timestamp.strftime('%Y-%m-%d %H:%M:%S')})
        else:
            return jsonify({"error": "Request not found"})
    else:
        return jsonify({"error": "Invalid request"})

@app.route('/webhook_listener/<endpoint>', methods=['POST'])
def webhook_listener(endpoint):
    # Extracting data from the request
    method = request.method
    ip = request.remote_addr
    headers = json.dumps(dict(request.headers)) if request.headers else "None"
    query_strings = json.dumps(dict(request.args)) if request.args else "None"
    raw_content = request.get_data(as_text=True) if request.data else "None"
    timestamp = datetime.utcnow()  # Assuming current time as the timestamp
    gmt_plus_6 = timedelta(hours=6)
    current_time_gmt_plus_6 = timestamp + gmt_plus_6


    # Creating a new Request object with extracted data
    new_request = Request(method=method, ip=ip, headers=headers,
                          query_strings=query_strings, raw_content=raw_content,
                          timestamp=current_time_gmt_plus_6, endpoint=endpoint)

    # Adding the new request to the database session and committing changes
    db.session.add(new_request)
    db.session.commit()

    # Returning the response
    return jsonify({"status": "success", "id": new_request.id})

if __name__ == '__main__':
    app.run(debug=True)
