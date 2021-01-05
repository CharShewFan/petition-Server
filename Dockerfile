FROM node:13.8.0-alpine3.10 as build

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN apk add --no-cache make gcc g++ python && \
  npm install --production --silent && \
  apk del make gcc g++ python
# Bundle app source
COPY . /usr/src/app


FROM node:13.8.0-alpine3.10

WORKDIR /usr/app
COPY --from=build /usr/src/app .

EXPOSE 4941
CMD [ "npm", "start" ]
