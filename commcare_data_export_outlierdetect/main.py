import outlierdetect
import pandas as pd
from sqlalchemy import create_engine
import submit_data
import yaml
import os

with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)


QUESTIONS = config['source_form_outlier_questions']
aggregation_col = 'username'
OUTLIER_RESULTS_EXCEL = 'outlier_results.xlsx'
activity_outlier_startdate = pd.to_datetime(config['activity_outlier_startdate']).date()
activity_outlier_enddate = pd.to_datetime(config['activity_outlier_enddate']).date()

def filter_dt(df):
    df['completed_time'] = pd.to_datetime(df['completed_time']).dt.date
    df_filtered = df.loc[(df['completed_time'] >= activity_outlier_startdate) &  (df['completed_time'] < activity_outlier_enddate)]
    return df_filtered

def restructure_outlier_output(output_dict):
    res = []


    for username, user_outlier_results in output_dict.items():
        for questionid, user_outlier_results in user_outlier_results.items():
            case_name = username + '_' + questionid
            expected_freq_unformatted = outlierdetect._normalize_counts(user_outlier_results['expected_freq'], sum([val for val in user_outlier_results['observed_freq'].values()]))
            expected_freq = {key: f"{value:.1f}" for key, value in expected_freq_unformatted.items()}
            user_question_results = {'username':username,'questionid': questionid, 'score':user_outlier_results['score'],
                            'p_value':user_outlier_results['p_value'], 
                            'expected_freq':str(expected_freq),
                            'observed_freq':str(user_outlier_results['observed_freq']),
                            'date_range' : f"{activity_outlier_startdate} to {activity_outlier_enddate}",
                            'name':case_name, 'owner_name': username, 'case_name': case_name}
                            #'expected_freq':str(user_outlier_results['expected_freq']),
            res.append(user_question_results)
    res_df = pd.DataFrame.from_records(res)
    res_df.to_excel(OUTLIER_RESULTS_EXCEL,index=False, engine='openpyxl')

if __name__ == '__main__':
    #Load data
    psql_connection = 'postgresql://postgres:postgres@postgres/postgres'
    eng = create_engine(psql_connection)
    sample_sql = "SELECT * FROM outlier_data_export;"

    data_all = pd.read_sql(sample_sql, eng)
    #Filter by month and year
    data = filter_dt(data_all)
    
    data.to_csv('output_sample.csv')
    #Compute MMA outlier scores
    (mma_scores, _) = outlierdetect.run_mma(data, aggregation_col, QUESTIONS)
    #Restructure the outlier scores for submission to CCHQ
    restructure_outlier_output(mma_scores)
    #Submit data to CCHQ
    success, message = submit_data.main(OUTLIER_RESULTS_EXCEL)
    

    