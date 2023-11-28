# syntax=docker/dockerfile:1
FROM python:3.8-slim
WORKDIR /tmp
RUN pip install psycopg2-binary commcare-export
RUN apt-get update && apt-get install -y postgresql-client curl unzip
COPY outlier_data_export.xlsx outlier_data_export.xlsx
COPY wait-for-postgres.sh wait-for-postgres.sh
COPY det.sh det.sh
CMD ["sh", "wait-for-postgres.sh", "postgres", "./det.sh"]