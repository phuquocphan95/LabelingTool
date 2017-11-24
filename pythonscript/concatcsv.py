import pandas as pd
import sys
import os.path as path

if __name__ == "__main__":
    __indir = sys.argv[1]
    __filenumber = int(sys.argv[2])
    __outfile = sys.argv[3]
    __frames = []

    for count in range(1, __filenumber + 1):
        csv = pd.read_csv(path.join(__indir, str(count) + ".csv") ,encoding="utf-8")
        __frames.append(csv)

    pd.concat(__frames).to_csv(__outfile, encoding="utf-8", index=False)
