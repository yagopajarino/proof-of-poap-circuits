from flask import Flask, jsonify, request
from poap_handlers import PoapHandlers

app = Flask(__name__)

@app.route('/api/poaps/<string:address>', methods=['GET'])
def events_of(address):
	message = PoapHandlers().events_of(address)
	return jsonify(message=message)


@app.route('/api/owners/<int:event_id>', methods=['GET'])
def owners_of(event_id):
	message = PoapHandlers().owners_of(event_id)
	return jsonify(message=message)
    
    
if __name__ == "__main__":
    app.run(debug=True)
