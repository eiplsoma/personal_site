FROM nginx:alpine@sha256:c8497b180665e631ec92a5091125bec5b214f0e2b99409e30653a125b37557da
COPY out/ /usr/share/nginx/html/
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
