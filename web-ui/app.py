from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='out')

# Parent directory (not web-ui) and then the folder that the scripts all use.
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.getcwd()), 'commcare_data_export_outlierdetect')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
UPLOAD_FILENAME = 'outlier_data_export-DET.xlsx'

@app.route('/')
@app.route('/<path:path>')
def serve_static(path='index.html'):
    return send_from_directory(app.static_folder, path)

@app.route('/submit', methods=['POST'])
def submit():
    if 'file' not in request.files:
        return jsonify(success=False, error='No file part'), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(success=False, error='No selected file'), 400

    if file:
        file_path = os.path.join(UPLOAD_FOLDER, UPLOAD_FILENAME)
        file.save(file_path)

    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
