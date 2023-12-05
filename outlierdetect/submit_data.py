

# A string to identify the origin of your data
DEVICE_ID = "outlier_detect"

# A string to identify case type
CCHQ_CASE_TYPE = 'outlier_detection_results'

# End of configurable settings

import csv
import os
import sys
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from http.client import responses as http_responses
from typing import Any, Iterable, List, Optional, Tuple
from xml.etree import ElementTree as ET
import requests
from jinja2 import Template
import yaml

with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)

# An XML namespace to identify your XForm submission
FORM_XMLNS = config['target_form']


@dataclass
class CaseProperty:
    name: str
    value: Any


@dataclass
class Case:
    id: str  # A UUID. Generated if not given in the data.
    name: str  # Required
    type: str  # A name for the case type. e.g. "person" or "site"
    modified_on: str  # Generated if not given. e.g. "2020-06-08T18:41:33.207Z"
    owner_id: str  # ID of the user or location that cases must be assigned to
    properties: List[CaseProperty]  # All other given data
    server_modified_on: Optional[str]


def main(filename):
    """
    Sends data to CommCare HQ using the Submission API.
    """
    data = get_data(filename)
    cases = as_cases(data)
    xform_str = render_xform(cases)
    success, message = submit_xform(xform_str)
    return success, message


def get_data(csv_filename) -> Iterable[dict]:
    """
    Reads data in CSV format from the given filename, and yields it as
    dictionaries.
    """
    with open(csv_filename) as csv_file:
        reader = csv.DictReader(csv_file)
        yield from reader


def as_cases(data: Iterable[dict]) -> Iterable[Case]:
    """
    Casts dictionaries as Case instances
    """
    reserved = ('id', 'name', 'case_type', 'modified_on', 'server_modified_on')
    for dict_ in data:
        properties = [CaseProperty(name=key, value=value)
                      for key, value in dict_.items()
                      if key not in reserved]
        yield Case(
            id=dict_.get('id', str(uuid.uuid4())),
            name=dict_['name'],
            type=CCHQ_CASE_TYPE,
            modified_on=dict_.get('modified_on', now_utc()),
            owner_id=os.environ['CC_USER'],
            server_modified_on=dict_.get('server_modified_on'),
            properties=properties,
        )


def render_xform(cases: Iterable[Case]) -> str:
    context = {
        'form_xmlns': FORM_XMLNS,
        'device_id': DEVICE_ID,
        'now_utc': now_utc(),
        'cchq_username': os.environ['CC_USER'],
        'cchq_user_id': os.environ['CC_USER'],
        'submission_id': uuid.uuid4().hex,
        'cases': list(cases),
    }
    with open('xform.xml.j2') as template_file:
        template = Template(template_file.read())
    xform = template.render(**context)
    return xform


def submit_xform(xform: str) -> Tuple[bool, str]:
    """
    Submits the given XForm to CommCare.

    Returns (True, success_message) on success, or (False,
    failure_message) on failure.
    """
    url = join_url(os.environ['CC_HQ'],
                   f'/a/{os.environ["CC_PROJECT"]}/receiver/api/')
    auth = (os.environ['CC_USER'], os.environ['CC_PASSWORD'])
    headers = {'Content-Type': 'text/html; charset=UTF-8'}
    response = requests.post(url, xform.encode('utf-8'),
                             headers=headers, auth=auth)
    if not 200 <= response.status_code < 300:
        return False, http_responses[response.status_code]
    return parse_response(response.text)


def parse_response(text: str) -> Tuple[bool, str]:
    """
    Parses a CommCare HQ Submission API response.

    Returns (True, success_message) on success, or (False,
    failure_message) on failure.

    >>> text = '''
    ... <OpenRosaResponse xmlns="http://openrosa.org/http/response">
    ...     <message nature="submit_success">   √   </message>
    ... </OpenRosaResponse>
    ... '''
    >>> parse_response(text)
    (True, '   √   ')

    """
    xml = ET.XML(text)
    message = xml.find('{http://openrosa.org/http/response}message')
    success = message.attrib['nature'] == 'submit_success'
    return success, message.text


def join_url(base_url: str, endpoint: str) -> str:
    """
    Returns ``base_url`` + ``endpoint`` with the right forward slashes.

    >>> join_url('https://example.com/', '/api/foo')
    'https://example.com/api/foo'
    >>> join_url('https://example.com', 'api/foo')
    'https://example.com/api/foo'

    """
    return '/'.join((base_url.rstrip('/'), endpoint.lstrip('/')))


def now_utc() -> str:
    """
    Returns a UTC timestamp in ISO-8601 format with the offset as "Z".
    e.g. "2020-06-08T18:41:33.207Z"
    """
    now = datetime.now(tz=timezone.utc)
    now_iso = now.isoformat(timespec='milliseconds')
    now_iso_z = now_iso.replace('+00:00', 'Z')
    return now_iso_z


def missing_env_vars():
    env_vars = (
        'CC_PROJECT',
        'CC_USER',
        'CC_PASSWORD',
    )
    return [env_var for env_var in env_vars if env_var not in os.environ]


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit()
    if missing := missing_env_vars():
        print('Missing environment variables:', ', '.join(missing))
        sys.exit(1)
    success, message = main(sys.argv[1])
    print(message)
    if not success:
        sys.exit(1)
