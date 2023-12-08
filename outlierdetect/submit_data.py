# A string to identify case type
CCHQ_CASE_TYPE = 'outlier_detection_results'
# End of configurable settings

import os
import sys
import uuid
from http.client import responses as http_responses
from typing import Tuple
from xml.etree import ElementTree as ET
import requests
from requests.auth import HTTPBasicAuth


def main(filename):
    """
    Sends data to CommCare HQ using the Submission API.
    """
    success, message = bulk_upload_case_data(filename)
    return success, message


def bulk_upload_case_data(xlsfile: str) -> Tuple[bool, str]:
    """
    Performs CommCare bulk upload of case data.

    Returns (True, success_message) on success, or (False,
    failure_message) on failure.
    """
    url = join_url(os.environ['CC_HQ'],
                   f'/a/{os.environ["CC_PROJECT"]}/importer/excel/bulk_upload_api/')
    auth = HTTPBasicAuth(os.environ['CC_USER'], os.environ['CC_PASSWORD'])

    # Prepare the files and data to be sent in the POST request
    files = {
        'file': (xlsfile, open(xlsfile, 'rb')),
    }
    data = {
        'case_type': CCHQ_CASE_TYPE,
        'search_field': 'external_id',
        'search_column': 'name',
        'create_new_cases': 'on',
        'name_column' : 'case_name'
    }

    response = requests.post(url, data=data,
                             files=files,auth=auth)
    if not 200 <= response.status_code < 300:
        return False, http_responses[response.status_code]
    return parse_response(response.text)


def parse_response(text: str) -> Tuple[bool, str]:
    """
    Parses a CommCare HQ Submission API response.

    Returns (True, success_message) on success, or (False,
    failure_message) on failure.

    """
    message = text['message']
    success = message == 'success'
    return success, message


def join_url(base_url: str, endpoint: str) -> str:
    """
    Returns ``base_url`` + ``endpoint`` with the right forward slashes.

    >>> join_url('https://example.com/', '/api/foo')
    'https://example.com/api/foo'
    >>> join_url('https://example.com', 'api/foo')
    'https://example.com/api/foo'

    """
    return '/'.join((base_url.rstrip('/'), endpoint.lstrip('/')))


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
