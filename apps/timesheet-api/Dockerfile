# syntax=docker/dockerfile:1

# Create a node environment
FROM node:14.18.3
ENV NODE_ENV=production

# create a working directory in the image environment
WORKDIR /api

# For watchtower, to enable watching this image
LABEL com.centurylinklabs.watchtower.enable="true"

# Copy over dependecy info
COPY ["package.json","package-lock.json","./"]

# Build dependencies
RUN npm config set strict-ssl false
RUN npm install --production

# Copy over build files and config
COPY ./build .
COPY ["web.config","iisnode.yml","./"]
COPY ./prod.env ./.env 

# How to run the image
CMD ["node","index.js"]