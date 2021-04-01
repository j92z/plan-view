FROM node:12-alpine3.10 as builder

WORKDIR /run/app/plan-view

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN npm config set registry http://registry.npm.taobao.org/

COPY . .

RUN npm install

RUN npm run build:prod


FROM nginx

WORKDIR /run/app/plan-view

COPY --from=builder /run/app/plan-view/dist/ /run/app/plan-view/
COPY docker-env/nginx/conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# ENTRYPOINT [ "nginx -g 'daemon off;'" ]
