# The Dockerfile defines an application’s image content via one or more build commands that configure that image.
# Once built, you can run the image in a container. For more information on Dockerfile, see the Docker user guide
# and the Dockerfile reference.

FROM node:14.15.4-alpine3.10 as build

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN apk add --no-cache make gcc g++ python && \
    npm install -g npm@7.4.2 && \
    npm install --production --silent && \
    apk del make gcc g++ python

# Bundle app source
COPY . /usr/src/app

# Note that we are building the app in one container (named as build) and running it in a 2nd container, this sort of
# simulates the distinction environment between dev and production
FROM node:14.15.4-alpine3.10

RUN npm install -g npm@7.4.2

WORKDIR /usr/app
COPY --from=build /usr/src/app .

EXPOSE 4941
CMD [ "npm", "start" ]
