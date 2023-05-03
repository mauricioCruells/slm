FROM node:18-slim AS development

WORKDIR /usr/src/app
COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:18-slim AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
# COPY scripts/sql ./scripts/sql
COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
RUN yarn install --frozen-lockfile --production
COPY --from=development /usr/src/app/src/config/orm-config.ts ./src/config/orm-config.ts
COPY --from=development /usr/src/app/dist ./dist


# COPY ci/slm-entrypoint.sh /usr/local/bin/
# RUN chmod o+x /usr/local/bin/slm-entrypoint.sh
# ENTRYPOINT ["slm-entrypoint.sh"]
CMD ["node", "dist/src/main"]
