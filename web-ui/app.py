from flask import Flask, request, jsonify, send_from_directory
import os
import time
import threading

app = Flask(__name__, static_folder='out')

# Parent directory (not web-ui) and then the folder that the scripts all use.
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.getcwd()), 'commcare_data_export_outlierdetect')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
UPLOAD_FILENAME = 'outlier_data_export-DET.xlsx'

# Shared state for progress tracking
progress_data = {
    'progress': 0,
    'complete': False
}

def simulate_long_running_task():
    global progress_data
    progress_data['progress'] = 0
    progress_data['complete'] = False
    for i in range(10):
        time.sleep(0.5)
        progress_data['progress'] += 10
    progress_data['complete'] = True

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

        # Start the long-running task in a new thread
        thread = threading.Thread(target=simulate_long_running_task)
        thread.start()

    return jsonify(success=True)

@app.route('/status', methods=['GET'])
def status():
    return jsonify(progress=progress_data['progress'], complete=progress_data['complete'])

if __name__ == '__main__':
    app.run(debug=True)
