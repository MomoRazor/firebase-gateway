FROM node:16-alpine as build
RUN mkdir app
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM node:16-alpine as service
RUN mkdir app
WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
RUN npm i --only=production
CMD npm run start