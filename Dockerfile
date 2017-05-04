FROM node:7.9.0-alpine

ARG API_ENDPOINT=/api

ENV NODE_ENV production
ENV API_ENDPOINT=${API_ENDPOINT}

RUN mkdir -p /bhht-datascape/ /bhht-datascape/client

ADD ./package.json /bhht-datascape/
ADD ./client/package.json /bhht-datascape/client/

RUN cd /bhht-datascape/client/ && npm --quiet install && npm --quiet install --only dev
RUN cd /bhht-datascape/ && npm --quiet install && npm --quiet install --only dev

ADD . /bhht-datascape

WORKDIR /bhht-datascape/client

RUN cd /bhht-datascape/client/ && npm run build

WORKDIR /bhht-datascape

VOLUME /bhht-datascape/client/

EXPOSE 4000

ENTRYPOINT ["/usr/local/bin/node", "./scripts/api.js"]
