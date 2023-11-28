import outlierdetect
import pandas as pd
import json

DATA_FILE = 'export.csv'
QUESTIONS = ['form.received_va_dose_before']
aggregation_col = 'username'

def flatten_outlier_output(output_dict, q):
    flattened_data = {outer_k: inner_v[q] for outer_k, inner_v in output_dict.items() if q in inner_v}
    print(flattened_data)


if __name__ == '__main__':
    #Load data
    data = pd.read_csv(DATA_FILE)
    # Compute MMA outlier scores
    (mma_scores, _) = outlierdetect.run_mma(data, aggregation_col, QUESTIONS)
    #flatten_outlier_output(mma_scores, QUESTIONS[0])
    with open("mma_output.json", "w") as outfile: 
        json.dump(mma_scores, outfile)

    