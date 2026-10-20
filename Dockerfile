FROM registry.access.redhat.com/ubi9/nodejs-20:latest
WORKDIR /opt/app-root/src
COPY package.json app.js ./
RUN npm install --omit=dev
EXPOSE 8080
CMD ["node", "app.js"]
