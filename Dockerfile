FROM resin/rpi-raspbian:latest
FROM node:latest

RUN \
  npm install -g pm2
  #n latest


## Conf essentielle
ADD local /fireco-local
WORKDIR /fireco-local


# Lien Updater
VOLUME /fireco
WORKDIR /fireco
CMD cp -r /data/worker/app/* /fireco/ && \
    ls /fireco && \
    npm install && \
    pm2-runtime start /fireco-local/ecosystem.json


#ENTRYPOINT ["bash"]