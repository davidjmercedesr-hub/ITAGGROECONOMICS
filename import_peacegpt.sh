#!/bin/sh
set -e

# Change these if needed
SRC="https://github.com/david-roetter/PeaceGPT.git"
DEST="https://github.com/davidrotterr/PeaceGPT.git"

TMPDIR="$(mktemp -d)"
echo "Cloning source to $TMPDIR..."
git clone --depth=1 "$SRC" "$TMPDIR"

cd "$TMPDIR"
echo "Removing original git history..."
rm -rf .git

echo "Initializing new repository..."
git init
git add .
git commit -m "Initial import from david-roetter/PeaceGPT"
git branch -M main

git remote add origin "$DEST"
echo "Pushing to $DEST (you may be prompted for credentials)..."
git push -u origin main

cd -
rm -rf "$TMPDIR"
echo "Done. Visit: https://github.com/davidrotterr/PeaceGPT"
