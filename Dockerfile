FROM node:14
WORKDIR /usr/src/chrome_funds_server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9898
CMD [ "npm", "start" ]
