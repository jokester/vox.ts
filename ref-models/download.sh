#!/usr/bin/env bash

set -uex

cd $(dirname "$0")

rm -rf models
mkdir models

git clone https://github.com/mikelovesrobots/mmmm --depth=1 models/mmmm
git clone https://github.com/kluchek/vox-models   --depth=1 models/vox-models
git clone https://github.com/ephtracy/voxel-model --depth=1 models/voxel-model

find . -name '*.vox' > vox-files.txt
