# =============================================================================
# Aggregation Script
# =============================================================================
#
# Script compiling the project's data into tiny pieces that the website will
# be able to process.
#
import os
import csv
import sys
import casanova
import click
import math
import gzip
import shutil
from string import digits
from tqdm import tqdm
from collections import Counter, defaultdict

csv.field_size_limit(sys.maxsize)

# =============================================================================
# Constants
# =============================================================================
MAX_YEAR = 2020
TOP_COUNT = 10_000

MAPPING = {
    'wikidata_code_b': 'wikidata_code',
    'name_b': 'name',
    'gender_b': 'gender',
    'birth_b': 'birth',
    'death_b': 'death',
    'ranking_final_b_5bis': 'ranking',
    'citizenship_1_b': 'citizenship',
    'occupation_1_l1_b': 'occupation',
    'un_subregion_new': 'region'
}

INTS = ['birth', 'death']
FLOATS = ['ranking']

# =============================================================================
# Helpers
# =============================================================================
def first_mismatch_index(a, b):
    if b is None:
        return 0

    for i in range(len(a)):
        if i == len(b):
            return i

        if a[i] != b[i]:
            return i
    return 0

def iter_with_prev(iterator):
    prev_item = None

    for item in iterator:
        if prev_item is not None:
            yield prev_item, item
        else:
            yield None, item

        prev_item = item

def encode_name(m, name):
    if name[0] in digits:
        return str(m) + '§' + name[m:]
    else:
        return str(m) + name[m:]

def parse(k, item):
    if k in INTS:
        return int(item)
    if k in FLOATS:
        return float(item)

    return item

def floor_to_nearest_10(n):
    return math.floor(n / 10) * 10

def decade_range(start, end=None):
    if end is None:
        end = MAX_YEAR

    start_decade = floor_to_nearest_10(start)
    end_decade = floor_to_nearest_10(end)

    for decade in range(start_decade, end_decade + 10, 10):
        yield decade

def dump_series(name, data, min_decade):
    with open('./data/%s_series.csv' % name, 'w') as f:
        writer = csv.writer(f)

        if name == 'default':
            writer.writerow(['decade', 'count'])

            for decade in decade_range(min_decade):
                writer.writerow([decade, data.get(decade, '')])
        else:
            writer.writerow(['decade', 'value', 'count'])

            for value, items in data.items():
                for decade in decade_range(min_decade):
                    writer.writerow([decade, value, items.get(decade, '')])

def gzip_file(p):
    with open(p, 'rb') as f_in, gzip.open(p + '.gz', 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)

    os.remove(p)

# =============================================================================
# CLI Action
# =============================================================================
@click.command()
@click.argument('path')
@click.option('--total', help='Total number of line in target file for the progress bar.', type=int)
def aggregate(path, total=None):

    # We need to ignore encoding errors because the file is misformatted
    data_file = open(path, 'r', encoding='utf-8', errors='ignore')

    reader = casanova.reader(data_file)
    mapping_pos = {t: reader.pos[f] for f, t in MAPPING.items()}

    def map_person(row):
        return {k: parse(k, row[i]) for k, i in mapping_pos.items() if row[i]}

    # Indexation
    series = {
        'default': Counter(),
        'gender': defaultdict(Counter),
        'occupation': defaultdict(Counter)
    }

    names = []

    top_file = open('./data/top.csv', 'w')
    top_writer = csv.DictWriter(top_file, fieldnames=list(MAPPING.values()))
    top_writer.writeheader()

    # Reading file line by line
    for row_i, row in tqdm(enumerate(reader), total=total, unit='lines', desc='Processing data'):
        person = map_person(row)

        names.append(person['name'])

        if person['ranking'] <= TOP_COUNT:
            top_writer.writerow(person)

        if 'birth' in person:
            for decade in decade_range(person['birth'], person.get('death')):
                series['default'][decade] += 1
                series['gender'][person.get('gender', 'Unknown')][decade] += 1
                series['occupation'][person.get('occupation', 'Unknown')][decade] += 1

        # if row_i >= 100:
        #     break

    data_file.close()
    top_file.close()

    # Dumping series data
    min_decade = min(series['default'].keys())

    dump_series('default', series['default'], min_decade)
    dump_series('gender', series['gender'], min_decade)
    dump_series('occupation', series['occupation'], min_decade)

    # Compressing names index using front coding
    with open('./data/names.txt', 'w') as of:
        for prev, name in iter_with_prev(sorted(names)):
            m = first_mismatch_index(name, prev)
            of.write(encode_name(m, name) + '\n')

    # Gzip some large files
    gzip_file('./data/top.csv')
    gzip_file('./data/names.txt')

# =============================================================================
# Operations
# =============================================================================
if __name__ == '__main__':
    aggregate()
