\copy (SELECT * FROM outlier_data_export) to /tmp/export.csv WITH CSV HEADER;
