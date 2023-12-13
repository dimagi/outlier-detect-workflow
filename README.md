CommCare Form Outlier Detection Workflow
===============

https://github.com/dimagi/outlier-detect-workflow

A command-line tool to generate customized outlier detection reports from [CommCare HQ](https://www.commcarehq.org). A prerequisite of this tool is that the user has deployed a CommCare application and performed some data collection.

Installation & Quick Start
--------------------------

0\. Install [Docker](https://docs.docker.com/engine/install/).

1\. Clone CommCare Form Outlier Detection Workflow repo

```
$ git clone https://github.com/dimagi/outlier-detect-workflow.git
```

2\. Generate a Data Export Tool config file using the [CommCare HQ Form Data Export](https://confluence.dimagi.com/display/commcarepublic/Form+Data+Export). First, create a new form export. In the "Export Settings", click "Generate a Data Export Tool config file" and change the "Export Name" and "Sheet Name" to "outlier_data_export".  For the fields, you must select "username", "completed_time" and the fields being analyzed for outlier detection.

Save the `outlier_data_export-DET.xlsx` file to the `commcare_data_export` directory.

3\. Edit the `config.yaml` file. Modify the `source_form_outlier_questions` to match the "Field" columns from the CommCare Data Export Tool Excel Query File for the outlier questions only. Update the `activity_outlier_startdate` and `activity_outlier_enddate` to indicate the time period on which to run the outlier detection algorithm. The datetimes need to be compatible want [Pandas to_datetime() method](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html).

Save the `config.yaml` file to the `outlier_detect` directory.

4\. Run the CommCare Form Outlier Detection Workflow tool. This action will export data from your CommCare HQ project space, run the outlier detection algorithm and upload the outlier results back into CommCare HQ.

```
./run.sh <commcare hq> <commcare username> <commcare api key or password> <commcare auth-mode> <commcare project> <commcare password> <commcare owner id>
```

More information on the required arguments are here:
- commcare hq: URL, such as https://www.commcarehq.org, or alias like "local" or "prod"
- commcare username: CommCare username
- commcare api key or password: Credentials needed to run CommCare Data Export tool
- commcare auth-mode: 'apikey' or 'password' to indicate which [authentication method](https://confluence.dimagi.com/display/commcarepublic/Authentication) to run CommCare Data Export tool
- commcare password: CommCare user password
- commcare owner id: CommCare owner id


