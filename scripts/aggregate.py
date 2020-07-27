import csv
import sys
import casanova
import click
import math
from tqdm import tqdm
from collections import Counter, defaultdict

csv.field_size_limit(sys.maxsize)

MAX_YEAR = 2020

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

def parse(k, item):
    if k in INTS:
        return int(item)
    if k in FLOATS:
        return float(item)

    return item

def floor_to_nearest_10(n):
    return math.floor(n / 10) * 10

def decade_range(birth, death=None):
    if death is None:
        death = MAX_YEAR

    start_decade = floor_to_nearest_10(birth)
    end_decade = floor_to_nearest_10(death)

    for decade in range(start_decade, end_decade + 10, 10):
        yield decade

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
    decades_data = {
        'default': Counter(),
        'gender': defaultdict(Counter)
    }

    names_file = open('./data/names.csv', 'w')
    names_writer = csv.writer(names_file)
    names_writer.writerow(['name'])

    # Reading file line by line
    for row_i, row in tqdm(enumerate(reader), total=total, unit='lines', desc='Processing data'):
        person = map_person(row)

        names_writer.writerow([person['name']])

        if 'birth' in person:
            for decade in decade_range(person['birth'], person.get('death')):
                decades_data['default'][decade] += 1
                decades_data['gender'][person.get('gender', 'unknown')][decade] += 1

        # if row_i >= 100:
        #     break

    data_file.close()
    names_file.close()

    # Dumping histogram data
    # TODO...

if __name__ == '__main__':
    aggregate()
