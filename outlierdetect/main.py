import outlierdetect
import pandas as pd
from sqlalchemy import create_engine
import submit_data
import yaml
import os

with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)


QUESTIONS = config['source_form_outlier_questions']
OWNER_ID=os.environ['CC_OWNERID']
aggregation_col = 'username'
OUTLIER_RESULTS_EXCEL = 'outlier_results.xlsx'

def restructure_outlier_output(output_dict):
    res = []
    for username, user_outlier_results in output_dict.items():
        for questionid, user_outlier_results in user_outlier_results.items():
            case_name = username + '_' + questionid
            user_question_results = {'username':username,'questionid': questionid, 'score':user_outlier_results['score'],
                            'p_value':user_outlier_results['p_value'],  'expected_freq':str(user_outlier_results['expected_freq']),
                            'observed_freq':str(user_outlier_results['observed_freq']), 'name':case_name, 'owner_id': OWNER_ID, 'case_name': case_name}
            res.append(user_question_results)
    res_df = pd.DataFrame.from_records(res)
    res_df.to_excel(OUTLIER_RESULTS_EXCEL,index=False, engine='openpyxl')

if __name__ == '__main__':
    #Load data
    psql_connection = 'postgresql://postgres:postgres@postgres/postgres'
    eng = create_engine(psql_connection)
    sample_sql = "SELECT * FROM outlier_data_export;"
    data = pd.read_sql(sample_sql, eng)
    #Compute MMA outlier scores
    (mma_scores, _) = outlierdetect.run_mma(data, aggregation_col, QUESTIONS)
    #Restructure the outlier scores for submission to CCHQ
    restructure_outlier_output(mma_scores)
    #Submit data to CCHQ
    success, message = submit_data.main(OUTLIER_RESULTS_EXCEL)
    

    