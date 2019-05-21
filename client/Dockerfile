FROM node:7.9.0-alpine AS client

ARG API_ENDPOINT=/api

ENV NODE_ENV production
ENV API_ENDPOINT=${API_ENDPOINT}

RUN mkdir /bhht-datascape

ADD ./package.json /bhht-datascape/

RUN cd /bhht-datascape/ && npm --quiet install --production false

ADD . /bhht-datascape

RUN cd /bhht-datascape/client/ \
    && npm --quiet install --production false \
    && npm run build \
    && rm -rf ./node_modules


FROM nginx:1.13-alpine

ENV API_PORT=4000

ENV API_HOST=api

COPY --from=client --chown=nginx:nginx /bhht-datascape/client /bhht-datascape/client

WORKDIR /bhht-datascape/client

RUN rm /etc/nginx/conf.d/default.conf

COPY ./client/docker-nginx.conf /etc/nginx/conf.d/docker.template

CMD /bin/sh -c "envsubst < /etc/nginx/conf.d/docker.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
