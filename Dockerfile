FROM node:7.9.0-alpine

ARG API_ENDPOINT=/api

ENV NODE_ENV production
ENV API_ENDPOINT=${API_ENDPOINT}

RUN apk add --no-cache su-exec

RUN mkdir -p /bhht-datascape/ /bhht-datascape/client

ADD ./package.json /bhht-datascape/
ADD ./client/package.json /bhht-datascape/client/

RUN cd /bhht-datascape/client/ && npm --quiet install --production false
RUN cd /bhht-datascape/ && npm --quiet install --production false

ADD . /bhht-datascape

RUN cd /bhht-datascape/client/ && npm run build

WORKDIR /bhht-datascape

VOLUME /bhht-datascape/client/

EXPOSE 4000

ENTRYPOINT ["su-exec", "node:node"]

CMD ["/usr/local/bin/node", "./scripts/api.js"]
