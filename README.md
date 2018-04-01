# Fireco Worker

[![Build Status](https://travis-ci.org/lyoko17220/FirecoWorker.svg?branch=master)](https://travis-ci.org/lyoko17220/FirecoUpdater)

Container applicatif de l'app Fireco

## Concept

Fireco est un service web servant aux stockage de données personnelles.


## Paramètres container Worker

**Paramètres utilisés**

- -p 8081 -> Pour la redirection de port de l’interface web du NAS
- -p 27017 -> Administration du MongoDB à l’extérieur du container
- -v /data -> Dossier des sources de l'app NodeJs
- -v /dbmongo -> Dossier de rémanence des données de la db


## Auteurs

- Nicolas SAGOT - @Lyoko17220