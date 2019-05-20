# Authentication JWT API


## Docker Container

The following instructions will guide you for the basic usage of this image

* First we need to build the image


		docker build -t \
			cablevision/authentication-jwt-api:lastest .


* Start the API


		docker run -d \
			--name authentication-jwt-api \
			-p 8080:3000 \
			cablevision/authentication-jwt-api


### Optional configuration

Follow this steps if you need to change the configuration of the api,
for i.e change the Identity Server Host URL.


* First get the config file from the repo /src/config/config.js and
  put that file in a safe directory of the docker engine host.

* If we choose a location like this: "/app/authentication-jwt-api/config.js",
  To start the api we need to point the config.js inside of the container
  to the config.js file of the Docker Engine Host. The volumes can make this for us.


  		docker run -d \
			--name authentication-jwt-api \
			-p 8080:3000 \
			-v /app/authentication-jwt-api/conf/config.js:/src/config/config.js \
			cablevision/authentication-jwt-api


### Support

  If you have any questions regarding this image, you can contact me via email
  at lcampana@cablevision.com.ar & asoria@cablevision.com.ar

