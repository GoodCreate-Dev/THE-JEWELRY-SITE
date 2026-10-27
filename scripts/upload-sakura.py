"""
Uploads deploy/sakura/www/ (made by scripts/build-sakura.mjs) into the Sakura server's www
folder over FTP with TLS. Asks for the server password when run; it is kept in memory only.

    python scripts/upload-sakura.py

Files already on the server with the same size are skipped, so a run that was cut off can
simply be started again. If the server drops the connection, the script reconnects and retries.
Server copies of instagram/posts.json and instagram/config.php are kept (the server owns them).
"""
import ftplib
import getpass
import os
import sys
import time

HOST = "the-jewelry.sakura.ne.jp"
USER = "the-jewelry"
REMOTE = "www"
LOCAL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "deploy", "sakura", "www")

# Files the server owns once it is running; uploaded only if missing there.
KEEP_ON_SERVER = {"instagram/posts.json", "instagram/config.php"}
RETRIES = 6


class Uploader:
    def __init__(self, password):
        self.password = password
        self.ftp = None

    def connect(self):
        if self.ftp:
            try:
                self.ftp.close()
            except Exception:
                pass
        self.ftp = ftplib.FTP_TLS(HOST, timeout=60)
        self.ftp.login(USER, self.password)
        self.ftp.prot_p()  # encrypt file transfers too
        self.ftp.voidcmd("TYPE I")

    def run(self, action):
        """Runs action(ftp); on a dropped connection waits, reconnects and tries again."""
        for attempt in range(1, RETRIES + 1):
            try:
                return action(self.ftp)
            except (OSError, EOFError, ftplib.error_temp) as e:
                if attempt == RETRIES:
                    raise
                print(f"      connection lost ({e.__class__.__name__}), reconnecting ({attempt}/{RETRIES - 1})...")
                time.sleep(3 * attempt)
                self.connect()

    def remote_size(self, path):
        def size(ftp):
            try:
                return ftp.size(path)
            except ftplib.error_perm:
                return None  # not there yet
        return self.run(size)

    def mkdir(self, path):
        def mkd(ftp):
            try:
                ftp.mkd(path)
            except ftplib.error_perm:
                pass  # already there
        self.run(mkd)

    def upload(self, local, path):
        def stor(ftp):
            with open(local, "rb") as fh:
                ftp.storbinary(f"STOR {path}", fh)
        self.run(stor)


def main():
    if not os.path.isfile(os.path.join(LOCAL, "index.html")):
        sys.exit("deploy/sakura/www is missing: run  node scripts/build-sakura.mjs  first.")
    up = Uploader(getpass.getpass(f"FTP password for {USER}@{HOST}: "))
    up.connect()
    print("Connected.")

    sent = skipped = 0
    for folder, _dirs, files in os.walk(LOCAL):
        rel = os.path.relpath(folder, LOCAL).replace("\\", "/")
        target = REMOTE if rel == "." else f"{REMOTE}/{rel}"
        if rel != ".":
            up.mkdir(target)
        for name in files:
            path = name if rel == "." else f"{rel}/{name}"
            local = os.path.join(folder, name)
            remote = up.remote_size(f"{target}/{name}")
            if remote is not None and (path in KEEP_ON_SERVER or remote == os.path.getsize(local)):
                skipped += 1
                continue
            up.upload(local, f"{target}/{name}")
            sent += 1
            print(f"up    {path}")
    up.ftp.quit()
    print(f"\nDone: {sent} uploaded, {skipped} already up to date, on {HOST}/{REMOTE}.")


if __name__ == "__main__":
    main()
