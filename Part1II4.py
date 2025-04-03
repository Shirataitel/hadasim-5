import os
import pandas as pd


# validate our data
def validate_data(file_path):
    df = pd.read_parquet(file_path)
    # convert to date format
    df['timestamp'] = pd.to_datetime(df['timestamp'], format='%d/%m/%Y %H:%M:%S', errors='coerce')

    # convert values that not number to Nan
    df['value'] = pd.to_numeric(df['value'], errors='coerce')

    # delete row with invalid values
    df.dropna(inplace=True)

    # check duplicated
    if df.duplicated().any():
        df.drop_duplicates(inplace=True)
    return df


#
def calculate_hourly_average(df):
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    # new column of hour -> dd:mm:yy hh:00:00
    df['hour'] = df['timestamp'].dt.floor('h')
    # calculate mean of value in every hour
    hourly_avg = df.groupby('hour')['value'].mean().reset_index()
    hourly_avg.columns = ['start time', 'average value']
    return hourly_avg


# split to smaller files by 2-days
def split_by_two_days(df):
    df['date'] = df['timestamp'].dt.date
    file_paths = []

    unique_sorted_dates = sorted(df['date'].unique())
    for i in range(0, len(unique_sorted_dates), 2):
        start_date = unique_sorted_dates[i]
        if i+1 < len(unique_sorted_dates):
            end_date = unique_sorted_dates[i+1]
        else:
            end_date = unique_sorted_dates[i]

        group = df[(df['date'] >= start_date) & (df['date'] <= end_date)].drop(columns=['date'])
        file_name = f"time_series_{start_date}_{end_date}.parquet"
        group.to_parquet(file_name, index=False)
        file_paths.append(file_name)
    df.drop(columns=['date'], inplace=True)
    return file_paths


#
def merge_hourly_results(files, output_file):
    # united all files to one df
    merged_df = pd.concat([pd.read_parquet(file) for file in files])
    merged_df['start time'] = pd.to_datetime(merged_df['start time'])
    merged_df = merged_df.drop_duplicates(subset=['start time'])
    merged_df.to_parquet(output_file, index=False)
    print(f"Final merged hourly averages saved to {output_file}")
    return merged_df


if __name__ == "__main__":
    # first of all valid the date
    df = validate_data("time_series.parquet")
    # split to smaller file by 2-days
    split_files = split_by_two_days(df)
    hourly_files = []
    # loop on the smaller files
    for file in split_files:
        daily_df = pd.read_parquet(file)
        # calculate hourly_ average in the smaller file
        hourly_avg = calculate_hourly_average(daily_df)
        # create new file that will save the hourly average
        output_file = file.replace("time_series", "hourly_avg")
        hourly_avg.to_parquet(output_file, index=False)
        hourly_files.append(output_file)
        os.remove(file)
    # merge all the files that saved the hourly average
    merge_hourly_results(hourly_files, "Part1II.parquet")
    print("The result file is ready!")
    for f in hourly_files:
        os.remove(f)
