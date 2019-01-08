FROM node:8-alpine as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN yarn install \
    && yarn cache clean 
COPY . /usr/src/app
RUN yarn grunt:production \
    && cd dist
WORKDIR /usr/src/app/dist
EXPOSE 3100

FROM node:8-alpine

COPY --from=builder /usr/src/app/dist/ /opt/chatbot/

COPY package.json yarn.lock /opt/chatbot/

RUN cd /opt/chatbot && yarn install --production && yarn cache clean

ENTRYPOINT cd /opt/chatbot/ && node server.js --env=$NODE_ENV