# syntax=docker/dockerfile:1
FROM python:3.8-slim
WORKDIR /tmp
RUN pip install psycopg2-binary commcare-export pyyaml
RUN apt-get update && apt-get install -y postgresql-client curl unzip
COPY . .
CMD ["sh", "wait-for-postgres.sh", "postgres", "./det.sh"]