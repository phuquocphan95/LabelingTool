import pandas as pd
import sys

if __name__ == "__main__":
    __file = sys.argv[1]
    __labels = sys.argv[2].split(',')
    csv = pd.read_csv(__file)
    csv.label = __labels
    csv.to_csv(__file, encoding="utf-8", index=False)
