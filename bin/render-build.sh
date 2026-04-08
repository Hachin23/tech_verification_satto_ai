#!/usr/bin/env bash
set -o errexit

# Bundler
bundle install
# Yarn --productionを付けて、開発用の余計なライブラリを入れない
yarn install --production
# Vite build
bundle exec vite build --mode production
# Rails assets
RAILS_ENV=production SKIP_CSS_BUILD=true bundle exec rails assets:precompile
# DB
bundle exec rails db:migrate
