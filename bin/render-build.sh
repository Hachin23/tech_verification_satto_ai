#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
yarn install # または npm install
bundle exec vite build --mode production
bundle exec rails assets:precompile
bundle exec rails assets:clean
bundle exec rails db:migrate

