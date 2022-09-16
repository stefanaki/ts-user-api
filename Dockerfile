FROM node:alpine3.15

WORKDIR /api

COPY package.json .

COPY package-lock.json .

RUN npm ci

COPY . .

EXPOSE 3000

VOLUME [ "/node_modules" ]

CMD [ "npm", "run", "dev" ]