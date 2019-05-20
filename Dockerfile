FROM node:5-onbuild
MAINTAINER Lucas Campana Levy <lcampana@cablevision.com.ar> & Andres Natanael Soria <asoria@cablevision.com.ar>

# Install app dependencies
COPY package.json /src/package.json

WORKDIR /src

RUN npm install

# Bundle app source
COPY ./src /src

EXPOSE 3000

ENTRYPOINT ["node", "app.js"]
