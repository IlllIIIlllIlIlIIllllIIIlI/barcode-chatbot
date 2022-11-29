FROM node:19-bullseye-slim

COPY . .

RUN npm i
RUN npm run compile

ENTRYPOINT [ "node", "dist/index.js" ]
