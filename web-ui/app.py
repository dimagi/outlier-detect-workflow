from flask import Flask, request, jsonify, send_from_directory
import os
import time
import threading
import yaml
from datetime import datetime
import json
import subprocess

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

# Function to convert string to datetime 
def format_date(date_time_str): 
    # Parse the datetime string
    dt = datetime.strptime(date_time_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    # Extract and return only the date
    dt_str = str(dt.date())
    return dt_str

def simulate_long_running_task():
    global progress_data
    progress_data['progress'] = 0
    progress_data['complete'] = False
    for i in range(10):
        time.sleep(0.5)
        progress_data['progress'] += 10
    progress_data['complete'] = True

def run_outlier_detection_task(creds, config, det_config_file_path):
    # Your actual outlier detection code here
    print("Outlier detection function executed.")
    #TODO: Finish this
    #Set credentials as environment variables
    os.environ['CC_HQ'] = creds['ccHqUrl']
    os.environ['CC_USER'] = creds['ccUser']
    os.environ['CC_PASSWORD'] = str(creds['ccPassword'])
    os.environ['CC_PROJECT'] = creds['ccProjectSpace']
    os.environ['CC_APIKEY'] = creds['ccApiKey']
    os.environ['CC_OWNERID'] = creds['ccOwnerID']
    os.environ['CC_AUTH_MODE']='apikey'


    #Write the config to a yaml file
    config_outliertool = {}
    date_range = json.loads(config['date_range'])
    config_outliertool['source_form_outlier_questions'] = [str(x) for x in json.loads(config['fields'])
    config_outliertool['activity_outlier_startdate'] = convert_to_date(date_range['from'])
    config_outliertool['activity_outlier_enddate'] = convert_to_date(date_range['to'])


    # File path where the YAML file will be created
    currdatetime = datetime.now().strftime("%Y%m%d%H%M")
    yaml_filename = 'config' + currdatetime +  '.yaml'
    yaml_file_path = os.path.join(UPLOAD_FOLDER, yaml_filename)
    

    # Writing data to a YAML file
    with open(yaml_file_path, 'w') as yaml_file:
        yaml.dump(config_outliertool, yaml_file, default_flow_style=False)

    #Run shell command for outlier detect workflow
    command = ['../run.sh'] + [yaml_file_path, det_config_file_path]
    subprocess.run(command)


    #delete config file

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

        # Debug output of submitted fields
        config = {}
        creds = {}
        date_range = request.form.get('dateRange')
        creds['ccHqUrl'] = request.form.get('ccHqUrl')
        creds['ccUser'] = request.form.get('ccUser')
        creds['ccPassword'] = request.form.get('ccPassword')
        creds['ccProjectSpace'] = request.form.get('projectSpace')
        creds['ccApiKey'] = request.form.get('ccApiKey')
        creds['ccOwnerID'] = request.form.get('ownerId')

        config['date_range'] = date_range
        config['fields'] = request.form.get('fields')

        # Start the long-running task in a new thread
        thread = threading.Thread(target=run_outlier_detection_task, args=(creds, config, file_path))
        thread.start()

    return jsonify(success=True)

# @app.route('/run-outlier-detection', methods=['POST'])
# def run_outlier_detection():
#     # Start the outlier detection task in a new thread
#     thread = threading.Thread(target=run_outlier_detection_task)
#     thread.start()
#     return jsonify({"message": "Outlier detection started successfully!"})

@app.route('/status', methods=['GET'])
def status():
    return jsonify(progress=progress_data['progress'], complete=progress_data['complete'])

if __name__ == '__main__':
    app.run(debug=True)
