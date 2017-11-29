import nnvlp
import pandas as pd
import sys
import os.path as path

if __name__ == "__main__":
    __file = sys.argv[1]
    __outdir = sys.argv[2]
    __counter = 0
    __posts = pd.read_csv(__file, encoding="utf-8")["posts"]
    __model = nnvlp.NNVLP()

    for post in __posts:
        __counter = __counter + 1
        __result = __model.predict(post)
        __tokens = sum(__result["token_text"], [])
        __pos = sum(__result["pos"], [])
        __labels = [u"O" for i in __tokens]
        __data = {"label" : __labels, "token" : __tokens, "pos": __pos}
        pd.DataFrame(data=__data)\
            .to_csv(path.join(__outdir, str(__counter) + ".csv"), encoding="utf-8", index = False)

    print '{"postnumber" :' + str(__counter) + '}'
