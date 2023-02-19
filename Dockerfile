FROM node:19.5.0

ADD . /app
WORKDIR /app
RUN npm ci