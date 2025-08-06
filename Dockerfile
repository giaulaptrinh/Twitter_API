FROM node:21

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY ecosystem.config.js .
COPY .env.production .
COPY ./src ./src
COPY ./openapi ./openapi

RUN apt-get update && apt-get install -y ffmpeg libvips-dev build-essential python3 && rm -rf /var/lib/apt/lists/*

RUN npm install pm2 -g
RUN npm install
RUN npm run build

EXPOSE 3300

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]