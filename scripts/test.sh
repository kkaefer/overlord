#!/usr/bin/env sh

echo "$1"
cd "$1"
mkdir -p "repositories/$2"
mkdir -p "logs/$2"
cd "repositories/$2"

git init -q
git remote rm origin 2>/dev/null
git remote add origin "$3"

git fetch -q origin "$4" &&
git clean -d -f -q -x &&
git reset --hard "$5" &&
npm install &&
npm test
