import csv
import re
import sys
from string import digits
from tqdm import tqdm
from collections import Counter

TOTAL = 2291815

NAMES = []

with open('./data/names.csv') as f:
    reader = csv.reader(f)
    next(reader)

    for row_i, row in tqdm(enumerate(reader), total=TOTAL, desc='Indexing'):
        name = row[0]

        NAMES.append(name)

        # if row_i >= 100:
        #     break

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

COMPRESSED_NAMES = []

with open('./data/names-compressed.txt', 'w') as of:
    for prev, name in iter_with_prev(sorted(NAMES)):
        m = first_mismatch_index(name, prev)
        COMPRESSED_NAMES.append(encode_name(m, name))
        of.write(encode_name(m, name) + '\n')

# PAREN_PATTERN = re.compile(r'\([^)]+\)', re.I)
# def extract_parentheses(name):
#     m = PAREN_PATTERN.search(name)

#     if m is not None:
#         return m.group(0)

# REPETITIONS = Counter()
# for name in sorted(COMPRESSED_NAMES, key=lambda s: s[::-1]):
#     pattern = extract_parentheses(name)

#     if pattern:
#         REPETITIONS[pattern] += 1

# n = 0
# for name, count in REPETITIONS.most_common(256):
#     if count < 2:
#         continue

#     n += count

#     print(name, count)

# print(n, n / TOTAL)
