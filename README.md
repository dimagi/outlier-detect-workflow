CommCare Form Outlier Detection Workflow
===============

https://github.com/dimagi/outlier-detect-workflow

A command-line tool to generate customized outlier detection reports from [CommCare HQ](https://www.commcarehq.org).

Installation & Quick Start
--------------------------

0a\. Install [Docker](https://docs.docker.com/engine/install/).

0b\. Sign up for [CommCare HQ](https://www.commcarehq.org/) if you have not already.

1\. Clone CommCare Form Outlier Detection Workflow repo

```
$ git clone https://github.com/dimagi/outlier-detect-workflow.git
```

2\. Create a project space and application.

3\. Visit the Release Manager, make a build, click the star to release it.

4\. Use Web Apps and fill out some forms.

5\. Modify the `outlier_data_export.xlsx` to pull the data for this outlier detection run. The data is extracted from CommCareHQ using the [CommCare Data Export Tool](https://confluence.dimagi.com/display/commcarepublic/CommCare+Data+Export+Tool). First, modify the "Filter Value" column to match your form XMLNS / case type. See [this page](https://confluence.dimagi.com/display/commcarepublic/Finding+a+Form%27s+XMLNS) to determine the XMLNS for your form. Next, modify the last row's "Source Field" to indicate which survey field to run the outlier detection on. See documentation on [how to reference fields in forms and cases](https://confluence.dimagi.com/display/commcarepublic/How+to+reference+Fields+in+Forms+and+Cases) for further assistance. Finally, rename the last row's "Field" column as the label for this survey question. Leave the rest of the file as-is, it has been pre-populated with other important data for your convenience.

For more information, see documentation on the [CommCare Data Export Tool Excel Query File](https://confluence.dimagi.com/display/commcarepublic/The+Excel+Query+File).

Save the `outlier_data_export.xlsx` to the `commcare_data_export` directory.

6\. Edit the `config.yaml` file. Modify the `source_form_outlier_questions` to match the "Field" columns from the CommCare Data Export Tool Excel Query File for the outlier questions only. Update the `activity_outlier_startdate` and `activity_outlier_enddate` to indicate the time period on which to run the outlier detection algorithm. The datetimes need to be compatible want [Pandas to_datetime() method](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html).

Save the `config.yaml` file to the `outlier_detect` directory.

7\. Create an application in your CommCare project space to define the outlier detection case type. In the application, assign `outlier_detection_results` to the "Case Type" and upload `outlier_detection_form.xml` (in this directory) as the form.

8\. Run the CommCare Form Outlier Detection Workflow tool. This action will export data from your CommCare HQ project space, run the outlier detection algorithm and upload the outlier results back into CommCare HQ.

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


