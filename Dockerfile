FROM node:12-alpine

# Create app directory
WORKDIR /home/projects/GrowWellbeing-API

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV NODE_ENV="development"
ENV PORT=8000

ENV MONGO_URL="mongodb://localhost:27017/"
ENV MONGO_DB_NAME="Grow_Wellbeing_dev"
ENV MONGO_USER=
ENV MONGO_PASS=
ENV MONGO_AUTH_SOURCE=
ENV REDIS_PORT=5379
ENV REDIS_HOST=127.0.0.1

ENV PASSWORD_KEY="password_key"
ENV TOKEN_EXPIRE_HOURS=1

EXPOSE 8000
CMD [ "node", "appStarter.js" ]