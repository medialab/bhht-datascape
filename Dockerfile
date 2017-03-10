FROM node:7.7.2

ADD . /bhht-datascape

WORKDIR /bhht-datascape

RUN npm install --quiet

CMD ["npm", "start"]
