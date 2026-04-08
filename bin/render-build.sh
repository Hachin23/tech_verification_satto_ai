#!/usr/bin/env bash
set -o errexit

# Bundler
bundle install
# Yarn
yarn install --frozen-lockfile
# Rails assets（ここでViteも実行される）
RAILS_ENV=production NODE_ENV=production bundle exec rails assets:precompile
# DB
bundle exec rails db:prepare
