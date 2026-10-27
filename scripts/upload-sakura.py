"""
Uploads deploy/sakura/www/ (made by scripts/build-sakura.mjs) into the Sakura server's www
folder over FTP with TLS. Asks for the server password when run; it is never stored.

    python scripts/upload-sakura.py

Server copies of instagram/posts.json and instagram/images/ are kept (fetch.php writes them),
and so is instagram/config.php once the token has been pasted there.
"""
import ftplib
import getpass
import os
import sys

HOST = "the-jewelry.sakura.ne.jp"
USER = "the-jewelry"
REMOTE = "www"
LOCAL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "deploy", "sakura", "www")

# Files the server owns once it is running; uploaded only if missing there.
KEEP_ON_SERVER = {"instagram/posts.json", "instagram/config.php"}


def remote_names(ftp, folder):
    try:
        return {os.path.basename(n) for n in ftp.nlst(folder)}
    except ftplib.error_perm:
        return set()


def main():
    if not os.path.isfile(os.path.join(LOCAL, "index.html")):
        sys.exit("deploy/sakura/www is missing: run  node scripts/build-sakura.mjs  first.")
    password = getpass.getpass(f"FTP password for {USER}@{HOST}: ")
    ftp = ftplib.FTP_TLS(HOST, timeout=60)
    ftp.login(USER, password)
    ftp.prot_p()  # encrypt file transfers too
    print("Connected.")

    count = 0
    for folder, dirs, files in os.walk(LOCAL):
        rel = os.path.relpath(folder, LOCAL).replace("\\", "/")
        target = REMOTE if rel == "." else f"{REMOTE}/{rel}"
        if rel != ".":
            try:
                ftp.mkd(target)
            except ftplib.error_perm:
                pass  # already there
        existing = remote_names(ftp, target) if rel == "instagram" else set()
        for name in files:
            path = name if rel == "." else f"{rel}/{name}"
            if path in KEEP_ON_SERVER and name in existing:
                print(f"keep  {path} (server copy)")
                continue
            with open(os.path.join(folder, name), "rb") as fh:
                ftp.storbinary(f"STOR {target}/{name}", fh)
            count += 1
            print(f"up    {path}")
    ftp.quit()
    print(f"\nDone: {count} files uploaded to {HOST}/{REMOTE}.")


if __name__ == "__main__":
    main()
