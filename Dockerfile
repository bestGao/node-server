FROM node:14
WORKDIR /usr/src/chrome_funds_server
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . .
EXPOSE 9898
CMD [ "npm", "start" ]
