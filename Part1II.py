import os
import pandas as pd
import sys

csv = 0



# validate our data
def validate_data(file_path):
    if csv:
        df = pd.read_csv(file_path, dtype=str)
    else:
        df = pd.read_parquet(file_path)
    # convert to date format, if not put Nat
    df['timestamp'] = pd.to_datetime(df['timestamp'], format='%d/%m/%Y %H:%M:%S', errors='coerce')

    # convert values that not number to Nan
    df['value'] = pd.to_numeric(df['value'], errors='coerce')

    # delete row with invalid values
    df.dropna(inplace=True)

    # check duplicated
    if df.duplicated().any():
        df.drop_duplicates(inplace=True)
    return df


def calculate_hourly_average(df):
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    # new column of hour -> dd:mm:yy hh:00:00
    df['hour'] = df['timestamp'].dt.floor('h')
    # calculate mean of value in every hour
    hourly_avg = df.groupby('hour')['value'].mean().reset_index()
    hourly_avg.columns = ['start time', 'mean']
    return hourly_avg


# split to smaller files by day
def split_by_day(df):
    # column of date (without time)
    df['date'] = df['timestamp'].dt.date
    file_paths = []

    # list of sorted dates
    unique_sorted_dates = sorted(df['date'].unique())
    for date in unique_sorted_dates:
        # df all row with the same date
        day = df[(df['date'] == date)].drop(columns=['date'])
        if csv:
            file_name = f"time_series_{date}.csv"
            day.to_csv(file_name, index=False)
        else:
            file_name = f"time_series_{date}.parquet"
            day.to_parquet(file_name, index=False)
        file_paths.append(file_name)
    df.drop(columns=['date'], inplace=True)
    return file_paths


def merge_hourly_results(files, output_file):
    # united all files to one df
    if csv:
        merged_df = pd.concat([pd.read_csv(file) for file in files])
    else:
        merged_df = pd.concat([pd.read_parquet(file) for file in files])
    merged_df['start time'] = pd.to_datetime(merged_df['start time'])
    merged_df = merged_df.drop_duplicates(subset=['start time'])
    if csv:
        merged_df.to_csv(output_file, index=False)
    else:
        merged_df.to_parquet(output_file, index=False)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Put file name!")
        exit(1)
    input_file = sys.argv[1]
    # check what kind of file
    if input_file.endswith('.csv'):
        csv = 1
    # first of all valid the date
    df = validate_data(input_file)
    # split to smaller file by day
    split_files = split_by_day(df)
    # arr of average hour smaller files names
    hourly_files = []
    # loop on the smaller files
    for file in split_files:
        if csv:
            daily_df = pd.read_csv(file)
        else:
            daily_df = pd.read_parquet(file)
        # calculate hourly average in the smaller file
        hourly_avg = calculate_hourly_average(daily_df)
        # create new file that will save the hourly average by day
        # and save the name in arr
        output_file = file.replace("time_series", "hourly_avg")
        hourly_files.append(output_file)
        if csv:
            hourly_avg.to_csv(output_file, index=False)
        else:
            hourly_avg.to_parquet(output_file, index=False)
        os.remove(file)
    # merge all the files that saved the hourly average
    if csv:
        merge_hourly_results(hourly_files, "Part1II.csv")
    else:
        merge_hourly_results(hourly_files, "Part1II.parquet")
    print("The result file is ready!")
    for f in hourly_files:
        os.remove(f)
