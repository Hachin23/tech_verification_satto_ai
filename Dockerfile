FROM ruby:3.2.9

# 基本設定
ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

# Node.js 22.x セットアップ+ 最適化
RUN apt-get update -qq \
&& apt-get install -y ca-certificates curl gnupg \
&& mkdir -p /etc/apt/keyrings \
&& curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
&& NODE_MAJOR=22 \
&& echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
&& curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/yarnkey.gpg \
&& echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# パッケージインストール + キャッシュ削除（重要!）
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    yarn \
    vim \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# アプリケーション設定
RUN mkdir /app
WORKDIR /app

# 1. 先に Gemfile 関連だけコピーして bundle install
COPY Gemfile Gemfile.lock /app/
RUN bundle install

# 2. 先に package.json 関連だけコピーして yarn install
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

# 3. 最後に残りの全ファイルをコピー
COPY . /app
