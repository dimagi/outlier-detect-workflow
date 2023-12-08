FROM adixondimagi/outlierdetect
WORKDIR /tmp
RUN pip install psycopg2-binary requests SQLAlchemy openpyxl
RUN apt-get update && apt-get install -y postgresql-client curl unzip
COPY main.py main.py
COPY submit_data.py submit_data.py
COPY wait-for-postgres.sh wait-for-postgres.sh
COPY pg-export.sh pg-export.sh
COPY export_to_disk.sql export_to_disk.sql
COPY config.yaml config.yaml
CMD ["sh", "wait-for-postgres.sh", "postgres", "python3", "main.py"]