FROM nexus-docker.craigmiller160.us/nginx-base:1.1.3

COPY ./build/expense-tracker-ui-*.tgz /var/www/expense-tracker-ui.tgz
RUN tar xvf /var/www/expense-tracker-ui.tgz -C /var/www/
RUN rm /var/www/expense-tracker-ui.tgz
RUN cp -R /var/www/package/build/* /var/www/
RUN rm -rf /var/www/package
RUN cp /var/www/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx","-g","daemon off;"]