#!/usr/bin/env bash
# Publishes the current build to the `gh-pages` branch, which GitHub Pages serves at
# https://ikennaemejuru1-hash.github.io/HAUNTED/
#
# Why a separate branch: the preview holds only built files, so it never mixes with the
# source code on the development branches. Each deploy adds a normal commit (no force
# push), so earlier previews stay in the history.
set -euo pipefail

SOURCE_SHA=$(git rev-parse --short HEAD)
SOURCE_BRANCH=$(git branch --show-current)
WORKTREE=$(mktemp -d)

npm run build
# Tells GitHub Pages to serve files as they are (no Jekyll processing).
touch dist/.nojekyll

# Check out gh-pages in a temporary folder, creating it the first time.
if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch -q origin gh-pages
  git worktree add -q -B gh-pages "$WORKTREE" origin/gh-pages
else
  git worktree add -q --orphan -b gh-pages "$WORKTREE"
fi

# Replace the old build with the new one, keeping only git's own metadata.
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist/. "$WORKTREE"/

cd "$WORKTREE"
git add -A
if git diff --cached --quiet; then
  echo "Preview already up to date."
else
  git commit -q -m "preview: build of ${SOURCE_BRANCH}@${SOURCE_SHA}"
  git push -q origin gh-pages
  echo "Preview published from ${SOURCE_BRANCH}@${SOURCE_SHA}."
fi
cd - >/dev/null
git worktree remove --force "$WORKTREE"
