FROM ghcr.io/uikoo9/node:22

# git
RUN apk update && apk add git && git --version

# pm2
RUN npm install pm2 -g --no-cache --verbose
RUN pm2 install pm2-intercom

# workdir
WORKDIR /home/tubiao-index

# npm i
COPY ./package.json /home/tubiao-index/package.json
RUN npm i --no-cache --verbose

# copy
COPY ./server /home/tubiao-index/server
COPY ./server/config-production.js /home/tubiao-index/server/config.js
COPY ./assets /home/tubiao-index/assets
COPY ./views /home/tubiao-index/views
COPY ./app.js /home/tubiao-index/app.js
COPY ./ecosystem.config.js /home/tubiao-index/ecosystem.config.js

# port
EXPOSE 8002

# cmd
CMD ["pm2-runtime", "start", "ecosystem.config.js"]