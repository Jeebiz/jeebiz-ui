FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/
ADD ./jeebiz-ui.tar.gz /usr/share/nginx/html/
ENTRYPOINT ["nginx-debug","-g","daemon off;"]