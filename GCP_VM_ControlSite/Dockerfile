FROM node:20
WORKDIR /usr/src/app
COPY package.json package*.json ./
RUN npm install --only=production
COPY . .
CMD [ "npm", "start" ]
#CMD "/bin/sh", "-c", "pwd" 
#CMD ["/bin/sh","./debug.sh"]