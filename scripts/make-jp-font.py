"""
Makes the site's own small Noto Sans JP files (src/fonts/noto-sans-jp-{400,500}.woff2), and
the Shippori Mincho file for Japanese headlines (src/fonts/shippori-mincho-400.woff2): only
the characters the site's text uses, plus (Noto Sans JP only, for Instagram posts) all kana,
Japanese punctuation and full-width letters, so one small file replaces the ~270 pieces Google Fonts serves for Japanese.
Characters outside the file (e.g. a rare kanji in a new Instagram post) show in the device's
own Japanese font.

Run again after changing Japanese text in src/ (needs fonttools + brotli):
    python scripts/make-jp-font.py <path to NotoSansJP[wght].ttf> <path to ShipporiMincho-Regular.ttf>
The source fonts are the official variable Noto Sans JP and the static Shippori Mincho Regular
from github.com/google/fonts (both OFL).
"""
import os
import pathlib
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "fonts"
WEIGHTS = [400, 500]

# Every character in the site's source text.
chars = set()
for path in (ROOT / "src").rglob("*"):
    if path.suffix in {".ts", ".tsx", ".json", ".css"} and "fonts" not in path.parts:
        chars.update(path.read_text(encoding="utf-8", errors="ignore"))
# Shippori Mincho only sets the site's own headings and leads: just their characters, so the
# headline font (on the first screen of every page) stays small on phones.
site_text = "".join(sorted(c for c in chars | {chr(c) for c in range(0x20, 0x7F)} if c.isprintable()))
# Fixed sets: printable ASCII, Japanese punctuation, hiragana, katakana, full-width forms.
for lo, hi in [(0x20, 0x7E), (0x3000, 0x303F), (0x3040, 0x309F), (0x30A0, 0x30FF), (0xFF00, 0xFFEF)]:
    chars.update(chr(c) for c in range(lo, hi + 1))
chars.update("・ー〜…‥「」『』【】〈〉《》→←↑↓↗※〒℃°′″")
text = "".join(sorted(c for c in chars if c.isprintable()))

OUT.mkdir(parents=True, exist_ok=True)


def save(font, name, text=text):
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["palt", "kern", "liga", "vert", "vkrn", "vpal"]
    options.name_IDs = ["*"]
    sub = subset.Subsetter(options)
    sub.populate(text=text)
    sub.subset(font)
    target = OUT / name
    font.flavor = "woff2"
    font.save(target)
    print(f"{target.name}: {os.path.getsize(target) // 1024} KB")


for weight in WEIGHTS:
    save(instancer.instantiateVariableFont(TTFont(sys.argv[1]), {"wght": weight}), f"noto-sans-jp-{weight}.woff2")
save(TTFont(sys.argv[2]), "shippori-mincho-400.woff2", site_text)
print(f"{len(text)} characters ({len(site_text)} in Shippori Mincho)")
