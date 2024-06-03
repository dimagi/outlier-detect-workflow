CommCare Form Outlier Detection Workflow
===============

https://github.com/dimagi/outlier-detect-workflow

A command-line tool to generate customized outlier detection reports from [CommCare HQ](https://www.commcarehq.org). A prerequisite of this tool is that the user has deployed a CommCare application and performed some data collection.

Installation and Quick Start
--------------------------

0\. Install [Docker](https://docs.docker.com/engine/install/).

1\. Clone CommCare Form Outlier Detection Workflow repo

```
$ git clone https://github.com/dimagi/outlier-detect-workflow.git
```

### Run Instructions - Command Line Tool

1\. Generate a Data Export Tool config file using the [CommCare HQ Form Data Export](https://confluence.dimagi.com/display/commcarepublic/Form+Data+Export). First, create a new form export. In the "Export Settings", click "Generate a Data Export Tool config file" and change the "Export Name" and "Sheet Name" to "outlier_data_export".  For the fields, you must select "username", "completed_time" and the fields being analyzed for outlier detection.

Save the `outlier_data_export-DET.xlsx` file.

2\. Edit the `config.yaml` file and save it. Modify the `source_form_outlier_questions` to match the "Field" columns from the CommCare Data Export Tool Excel Query File for the outlier questions only. Update the `activity_outlier_startdate` and `activity_outlier_enddate` to indicate the time period on which to run the outlier detection algorithm.

3\. Run the CommCare Form Outlier Detection Workflow tool. This action will export data from your CommCare HQ project space, run the outlier detection algorithm and upload the outlier results back into CommCare HQ.

```
./run.sh <config.yaml filepath> <outlier_data_export-DET.xlsx filepath>
```

This command assumes CommCare authentication parameters are set in your environment variables. For more details, see ".env_template" file for all necessary environment variables.

You can optionally pass a .env file (see ".env_template") to this command:

```
./run.sh <config.yaml filepath> <outlier_data_export-DET.xlsx filepath> <.env filepath>
```

To protect your credentials, it is best to keep the .env file outside this repo or add it to your .gitignore file.

### Run Instructions - User Interface

0\. Install node js and n.

1\. From the web-ui directory, install needed packages: ```npm install```

2.\ Build the application: ```npx build```

3.\ Run the application using the following command from the web-ui directory: ```python app.py```. Open the user interface at http://127.0.0.1:5000.

4.\ Configure the algorithm run. Enter your CommCare credentials and the date range for the outlier detection.

5\. Generate a Data Export Tool config file using the [CommCare HQ Form Data Export](https://confluence.dimagi.com/display/commcarepublic/Form+Data+Export). First, create a new form export. In the "Export Settings", click "Generate a Data Export Tool config file" and change the "Export Name" and "Sheet Name" to "outlier_data_export".  For the fields, you must select "username", "completed_time" and the fields being analyzed for outlier detection.

Save the `outlier_data_export-DET.xlsx` file. Upload the file to the user interface.

6\. Run the tool.

Optional: CommCare Outlier Detection Reporting
--------------------------
Additionally, you can visualize the outlier reseults using [CommCare HQ's reporting](https://dimagi.atlassian.net/wiki/spaces/commcarepublic/pages/2198241457/Native+Reporting+in+CommCare) feature. Instructions for generating a report for the outlier detection algorith run is given in `Outlier Detection CommCare HQ Reporting.pdf`.
