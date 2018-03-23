FROM resin/rpi-raspbian:latest


RUN \
    apt-get update  && \
    apt-get install -y npm mongodb-server && \
    npm install -g n && \
    n latest && \
    npm install -g pm2


## Conf essentielle
ADD local /fireco-local
WORKDIR /fireco-local


# Lien Updater
VOLUME /fireco
WORKDIR /fireco
CMD cp -r /data/worker/app/* /fireco/ && \
    ls /fireco && \
    npm install && \
    pm2-runtime start /fireco-local/ecosystem.json &&
    service mongod start


#ENTRYPOINT ["bash"]