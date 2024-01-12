FROM adixondimagi/outlierdetect
WORKDIR /tmp
RUN pip install psycopg2-binary requests SQLAlchemy openpyxl
RUN apt-get update && apt-get install -y postgresql-client curl unzip
COPY . .
CMD ["python3", "main.py"]