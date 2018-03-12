#!/bin/bash
repoRoot="."
binRoot="."
if [[ -e $npm_package_config_webcube_monorepo_root ]]; then
  repoRoot="${npm_package_config_webcube_monorepo_root}"
  binRoot="${npm_package_config_webcube_monorepo_root}"
  if [[ ! -d ${binRoot}/node_modules/ ]]; then
    repoRoot="."
    binRoot="./node_modules/webcube"
  fi
fi
CFG_FILE="${repoRoot}/node_modules/webcube/configs/gulpfile.js"
(
  webcube-check
) && (
  node --max-old-space-size=8192 $binRoot/node_modules/.bin/gulp --gulpfile $CFG_FILE build:staticweb
) && (
  webcube-start-staticserver
)
