import csv
import re
from tqdm import tqdm
from collections import Counter

TOTAL = 2291815

def ngrams(n, tokens):
    limit = len(tokens) - n + 1

    for i in range(limit):
        yield tokens[i:i + n]

PAREN_PATTERN = re.compile(r'\([^)]+\)', re.I)
def extract_parentheses(name):
    m = PAREN_PATTERN.search(name)

    if m is not None:
        return m.group(0)

PREFIXES = Counter()
FIRST_NAMES = Counter()

with open('./data/names.csv') as f:
    reader = csv.reader(f)
    next(reader)

    for row_i, row in tqdm(enumerate(reader), total=TOTAL, desc='Indexing'):
        name = row[0]

        if '_' in name:
            first_name = name.split('_', 1)[0]

            if len(first_name) > 3:
                FIRST_NAMES[first_name + '_'] += 1

        # for p in range(5, 10 + 1):
        #     prefix = name[:p]

        #     if prefix:
        #         PREFIXES[prefix] += 1

        # if row_i >= 10_000:
        #     break

COMPRESSION_TABLE = {}

t = 0
n = 0
for g, c in FIRST_NAMES.most_common(255):
    if c < 100:
        continue

    print(g, c)
    t += c

    COMPRESSION_TABLE[g] = chr(n)

    n += 1

print(t, t / 2291815, n)
# print(COMPRESSION_TABLE)

with open('./data/names.csv') as f, open('./data/names-compressed.csv', 'w') as of:
    reader = csv.reader(f)
    next(reader)

    writer = csv.writer(of)
    writer.writerow(['name'])

    for row_i, row in tqdm(enumerate(reader), total=TOTAL, desc='Compressing'):
        name = row[0]

        if '_' in name:
            first_name, rest = name.split('_', 1)
            first_name += '_'

            if first_name in COMPRESSION_TABLE:
                name = COMPRESSION_TABLE[first_name] + rest

        writer.writerow([name])
