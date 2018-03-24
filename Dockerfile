FROM resin/rpi-raspbian:latest


RUN \
    apt-get update  && \
    apt-get install -y npm mongodb-server build-essential&& \
    npm install -g n && \
    n latest && \
    npm install -g pm2


## Conf essentielle
ADD local /fireco-local
WORKDIR /fireco-local


# Lien Updater

VOLUME /dbmongo
VOLUME /fireco
WORKDIR /fireco
CMD cp -r /data/worker/app/* /fireco/ && \
    ls /fireco && \
    npm install && \
    mongod --repair --dbpath /dbmongo/ && \
    pm2-runtime start /fireco-local/ecosystem.json && \
    mongod --dbpath /dbmongo/ & && \


#ENTRYPOINT ["bash"]