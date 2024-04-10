FROM adixondimagi/outlierdetect
WORKDIR /tmp
RUN pip install psycopg2-binary commcare-export pyyaml requests SQLAlchemy openpyxl
RUN apt-get update && apt-get install -y postgresql-client curl unzip
COPY . .
ENTRYPOINT ["sh", "./entrypoint.sh"]