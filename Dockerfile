FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=8787 \
    USE_HTTPS=true \
    HTTPS_CERT_PATH=/app/certs/localhost-cert.pem \
    HTTPS_KEY_PATH=/app/certs/localhost-key.pem

EXPOSE 8787

CMD ["sh", "-c", "npm run build && npm run server"]
