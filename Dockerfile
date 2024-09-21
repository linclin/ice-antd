# syntax=registry.cn-shenzhen.aliyuncs.com/dev-ops/dockerfile:1.9.0
FROM registry.cn-shenzhen.aliyuncs.com/dev-ops/node:20.17.0-alpine as node
RUN sed -i 's/https/http/' /etc/apk/repositories && \
    sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk update && \
    apk add ca-certificates && \
    rm -rf /var/cache/apk/*   /tmp/*  
ADD ./ /app/www/
WORKDIR /app/www/
RUN npm config set registry https://registry.npm.taobao.org && \
    npm install && \
    npm run build

FROM registry.cn-shenzhen.aliyuncs.com/dev-ops/nginx:1.27.1-alpine3.20
LABEL MAINTAINER="13579443@qq.com"
ENV TZ='Asia/Shanghai' 
ENV LANG UTF-8
ENV LC_ALL zh_CN.UTF-8
ENV LC_CTYPE zh_CN.UTF-8
RUN TERM=linux && export TERM
RUN sed -i 's/https/http/' /etc/apk/repositories && \
    sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk update &&\
    apk add ca-certificates tzdata && \
    echo "Asia/Shanghai" > /etc/timezone && \ 
    rm -rf /var/cache/apk/*   /tmp/* && \
    apk del tzdata && \
    echo 'alias ll="ls -l --color"' > /etc/profile.d/aliases.sh && \
    chmod +x /etc/profile.d/aliases.sh && \
    addgroup -g 1000 app && \
    adduser -u 1000 -G app -D app && \
    adduser -u 1001 -G app -D dev && \
    # chmod 4755 /bin/busybox  && \
    # chmod +w /etc/sudoers && \
    # echo "app ALL=(ALL) NOPASSWD: NOPASSWD: /bin/su " >> /etc/sudoers && \
    mkdir -p /app  &&\
    chown -R app:app /app 
WORKDIR /usr/share/nginx/html/
COPY --from=node --chown=app:app --chmod=755 /app/www/build/ /usr/share/nginx/html/