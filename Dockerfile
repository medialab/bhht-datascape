FROM node:7.9.0-alpine

ARG API_ENDPOINT /api

ENV NODE_ENV production
ENV API_ENDPOINT ${API_ENDPOINT}

RUN mkdir -p /bhht-datascape/ /bhht-datascape/client

ADD ./package.json /bhht-datascape/
ADD ./client/package.json /bhht-datascape/client/

RUN cd /bhht-datascape/client/ && npm --quiet --dev install
RUN cd /bhht-datascape/ && npm --quiet --dev install

ADD . /bhht-datascape

RUN cd /bhht-datascape/client/ && cp config.docker.json config.json

WORKDIR /bhht-datascape/client

RUN cd /bhht-datascape/client/ && npm run build

WORKDIR /bhht-datascape

VOLUME /bhht-datascape/client/

EXPOSE 4000

ENTRYPOINT ["/usr/local/bin/node", "./scripts/api.js"]
