from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='out')

@app.route('/')
@app.route('/<path:path>')
def serve_static(path='index.html'):
    return send_from_directory(app.static_folder, path)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    print(data)
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
