FROM adixondimagi/outlierdetect
WORKDIR /tmp
RUN pip install psycopg2-binary
RUN apt-get update && apt-get install -y postgresql-client curl unzip
COPY export.csv export.csv
COPY main.py main.py
CMD [ "python3", "main.py"]
# COPY wait-for-postgres.sh wait-for-postgres.sh
# COPY pg-export.sh pg-export.sh
# COPY export_to_disk.sql export_to_disk.sql
# CMD ["sh", "wait-for-postgres.sh", "postgres", "./pg-export.sh"]