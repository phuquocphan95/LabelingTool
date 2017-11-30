import pandas as pd
import sys
import os.path as path

if __name__ == "__main__":
    __file = sys.argv[1]
    __outdir = sys.argv[2]
    __counter = 0
    __df = pd.read_csv(__file, encoding="utf-8")

    __df.dropna(inplace=True)
    __cur_post = []
    __cur_tags = []

    for index, row in __df.iterrows():
        token = row['token']
        tag = row['pos']
        __cur_post.append(token)
        __cur_tags.append(tag)

        if token == "]":
            __counter = __counter + 1
            pd.DataFrame(data={"token": __cur_post, "pos": __cur_tags}) \
                .to_csv(path.join(__outdir, str(__counter) + ".csv"), encoding="utf-8", index=False)
            __cur_post = []
            __cur_tags = []

    print '{"postnumber" :' + str(__counter) + '}'
