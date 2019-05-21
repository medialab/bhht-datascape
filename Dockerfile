FROM node:7.9.0-alpine

ENV NODE_ENV production

RUN apk add --no-cache su-exec

RUN mkdir /bhht-datascape/ 

ADD ./package.json /bhht-datascape/

RUN cd /bhht-datascape/ && npm --quiet install --production false

ADD . /bhht-datascape

WORKDIR /bhht-datascape

EXPOSE 4000

ENTRYPOINT ["su-exec", "node:node"]

CMD ["/usr/local/bin/node", "./scripts/api.js"]
