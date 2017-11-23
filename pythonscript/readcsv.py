import pandas as pd
import sys

if __name__ == "__main__":
    __file = sys.argv[1]
    csv = pd.read_csv(__file)
    print csv.to_json(orient='records', lines=True)
