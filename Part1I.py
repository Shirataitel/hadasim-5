import os
import sys
from collections import Counter


def split_file(log_file):
    small_file_size = 100000  # the number of rows in the smaller file
    # read log_file
    with open(log_file, 'r', encoding='utf-8') as file:
        num_files = 0  # how many small file we have
        while True:
            # lines -> the 100,000 of the small file
            lines = []
            for _ in range(small_file_size):
                line = file.readline()
                # if end of file, break from for loop
                if not line:
                    break
                # save only the error itself and add to lines
                error_line = line.split('Error: ')
                lines.append(error_line[1])
            # if no new line, break from while loop
            if not lines:
                break
            # write the lines in the smaller file
            part_file = f"part_{num_files}.txt"
            with open(part_file, 'w', encoding='utf-8') as part:
                part.writelines(lines)
            # increase by 1
            num_files += 1
    return num_files


def errors_in_small_file(small_file):
    # save the count for each error
    small_count = Counter()
    with open(small_file, 'r', encoding='utf-8') as small:
        for err in small:
            # increase by 1 the count of the error that in err
            small_count[err.strip()] += 1
    return small_count


def count_merge_files(nun_of_files):
    # counter save for each error its count
    main_counter = Counter()
    # for every small file
    for i in range(nun_of_files):
        small_file = f"part_{i}.txt"
        # count the error and update the main table
        main_counter.update(errors_in_small_file(small_file))
        os.remove(small_file)
    return main_counter


def find_common_n(n, log_file):
    # split main file to smaller files
    nun_of_files = split_file(log_file)
    # count errors of each file and then merge them
    error_count = count_merge_files(nun_of_files)
    # return the n most common
    return error_count.most_common(n)


if __name__ == "__main__":
    # get 2 arguments
    if len(sys.argv) != 3:
        print("Put arguments!")
        exit(1)
    N = int(sys.argv[1])  # the N errors they want
    log_file = sys.argv[2]  # the file of errors

    # find the n common error
    res = find_common_n(N, log_file)
    # print the resultS
    for error, count in res:
        print(f"{error}: {count}")
