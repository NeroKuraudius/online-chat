FROM node:18-alpine
WORKDIR /app
COPY package*.json package-lock.json /app/
RUN npm install

COPY . /app/
RUN npm install && npm cache clean --force

EXPOSE 3000
CMD npm start