FROM node:current-alpine3.15 AS BUILD_IMAGE

SHELL ["/bin/ash", "-eo", "pipefail", "-c"]

# Install node-prune
RUN wget -qO- https://gobinaries.com/tj/node-prune | ash -s

WORKDIR /code

COPY . .

RUN npm i
RUN npm audit fix
RUN npm run build
RUN npm prune --omit=dev
RUN node-prune

FROM node:current-alpine3.15

COPY --from=BUILD_IMAGE /code/dist ./dist
COPY --from=BUILD_IMAGE /code/node_modules ./node_modules

ENTRYPOINT [ "node", "dist/index.js"]
