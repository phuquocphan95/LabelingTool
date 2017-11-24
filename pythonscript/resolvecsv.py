from pyvi.pyvi import ViTokenizer, ViPosTagger
import pandas as pd
import sys
import os.path as path

if __name__ == "__main__":
    __file = sys.argv[1]
    __outdir = sys.argv[2]
    __counter = 0
    csv = pd.read_csv(__file, encoding="utf-8")
    posts = csv["posts"]

    for post in posts:
        __counter = __counter + 1
        __tokens = ViPosTagger.postagging(ViTokenizer.tokenize(post))[0]
        __labels = [u"O" for i in __tokens]
        __data = {"label" : __labels, "token" : __tokens}
        pd.DataFrame(data=__data)\
            .to_csv(path.join(__outdir, str(__counter) + ".csv"), encoding="utf-8", index = False)

    print '{"postnumber" :'  + str(__counter) + '}'
