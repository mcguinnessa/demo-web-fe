FROM node:16-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production

#Remove default NGINX page
#RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from `builder` image
COPY --from=builder /app/.next /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV WRAPPER_HOST="ec2-3-8-157-149.eu-west-2.compute.amazonaws.com" 
ENV WRAPPER_PORT=3000


# Expose port
EXPOSE 3000 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]


## Fetching the latest node image on apline linux
#FROM node:alpine AS builder
#
## Declaring env
#ENV NODE_ENV production
#
## Setting up the work directory
#WORKDIR /app
#
## Installing dependencies
#COPY ./package.json ./
#RUN npm install
#
## Copying all the files in our project
#COPY . .
#
## Building our application
#RUN npm run build
#
## Fetching the latest nginx image
#FROM nginx
#
## Copying built assets from builder
##COPY --from=builder /app/build /usr/share/nginx/html
#COPY --from=builder /app/.next /usr/share/nginx/html
#
## Copying our nginx.conf
#COPY nginx.conf /etc/nginx/conf.d/default.conf
