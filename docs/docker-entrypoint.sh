#!/bin/sh
set -e
PORT=${PORT:-8080}
echo "server {
    listen ${PORT};
    server_name localhost;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
}" > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
