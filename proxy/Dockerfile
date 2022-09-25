FROM nginx

RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf


# if you do a change to nginx make sure to docker-compose build --no-cache