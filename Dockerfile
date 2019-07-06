FROM node:10.15.3-jessie-slim

WORKDIR /app

RUN node -v && npm -v

RUN apt-get update && apt-get install -y \
  wget \
  unzip \
  && rm -rf /var/lib/apt/lists/*

# Install Terraform
RUN wget --quiet https://releases.hashicorp.com/terraform/0.12.0/terraform_0.12.0_linux_amd64.zip \
  && unzip terraform_0.12.0_linux_amd64.zip \
  && mv terraform /usr/bin \
  && rm terraform_0.12.0_linux_amd64.zip

RUN terraform -v

# Install FFMPEG
RUN apt-get update ; apt-get install -y git build-essential gcc make yasm autoconf automake cmake libtool checkinstall libmp3lame-dev pkg-config libunwind-dev zlib1g-dev libssl-dev

RUN apt-get update \
  && apt-get clean \
  && apt-get install -y --no-install-recommends libc6-dev libgdiplus wget software-properties-common

ENV FFMPEG_VERSION 4.1

RUN wget https://www.ffmpeg.org/releases/ffmpeg-$FFMPEG_VERSION.tar.gz
RUN tar -xzf ffmpeg-$FFMPEG_VERSION.tar.gz; rm -r ffmpeg-$FFMPEG_VERSION.tar.gz
RUN cd ./ffmpeg-$FFMPEG_VERSION; ./configure --enable-gpl --enable-libmp3lame --enable-decoder=mjpeg,png --enable-encoder=png --enable-openssl --enable-nonfree

RUN cd ./ffmpeg-$FFMPEG_VERSION; make
RUN cd ./ffmpeg-$FFMPEG_VERSION; make install

RUN ffmpeg -version && ffmpeg -protocols

# Install yarn
RUN npm i yarn -g
RUN yarn -v

ADD package.json package.json
ADD yarn.lock yarn.lock

RUN yarn
EXPOSE 5000

CMD ["yarn", "start:server"]