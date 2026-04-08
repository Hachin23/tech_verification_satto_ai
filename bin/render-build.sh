#!/usr/bin/env bash
set -o errexit

# Bundler（本番最適化）
bundle config set without 'development test'
bundle install --jobs 4 --retry 3

# Yarn
yarn install --frozen-lockfile
# Vite build
NODE_ENV=production bundle exec vite build
# Rails assets
RAILS_ENV=production NODE_ENV=production SKIP_CSS_BUILD=true bundle exec rails assets:precompile
# DB
bundle exec rails db:prepare
