# CAHIER DES CHARGES API



## Gestion utilisateurs `/api/users`

### Inscription

Ajout d'un utilisateur à la base de données.

​	**URL :**  `/api/users/sign`

​	**Methode :** `POST`

#### Paramètres

- `username` - *Pseudo de l'utilisateur*
  **Requis** : [1 - 20 chaine de caractères]
 * `lastname`- *Nom de l'utilisateur*
   **Requis** : [1 - 32 lettres, -]
 * `firstname` - *Prénom de l'utilisateur*
   **Requis** : [1 - 32 lettres, -]
 * `password` - *Mot de passe de l'utilisateur*
   **Requis** : [6 - 15 string]

#### Succès

​	**Condition :** Tous les champs sont saisis et corrects.

​	**Code :** `200 OK`

​	**Exemple de réponse :** `id` - identifiant unique à l'utilisateur, `token` - identifiant de session.

```json
{
    "id" : 1234,
    "token" : "fc3e58ojq85e",
    "username" : "jdupont",
    "lastname" : "Dupont",
    "firstname" : "Jean"
}
```

#### Erreurs

​	**Condition :** Champs incomplets - incorrects - vides, utilisateur déjà existant

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** Renvoie le texte de réponse selon l'erreur, sinon renvoie un champ vide.

```json
{
    "username" : "Utilisateur déjà existant",
    "lastname" : "Veuillez saisir au minimum 1 et au maximum 32 caractères. Les accents et tirés '-' sont autorisés.",
    "firstname" : "Veuillez saisir au minimum 1 et au maximum 32 caractères. Les accents et tirés '-' sont autorisés.",
    "password" : ""
}
```

​	**Note :** Renvoie un champ vide si saisie correcte.

### Connexion

Authentification d'un utilisateur existant dans la base de données. Il faut que le "couple" `username` - `password` existe dans la base de données.

​	**URL :** `/api/user/login`

​	**Methode :** `GET`

#### Paramètres

 -`username` - *Nom d'utilisateur*
   **Requis :** champ non vide

 -`password` - *Mot de passe de l'utilisateur*
   **Requis :** champ non vide

#### Succès

​	**Condition :** Combinaison `username`/`password` présente dans la base de données.

​	**Code :** `200 OK`

​	**Exemple de réponse :** Connexion validée, renvoie du token d'accès.

```json
{
    "id" : 1234,
    "token" : "fc3e58ojq85e",
    "username" : "jdupont",
    "lastname" : "Dupont",
    "firstname" : "Jean"
}
```

#### Erreurs

​	**Condition :** Combinaison `username`/`password` inexistante dans la base de données, mot de passe erroné, utilisateur inexistant.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** Connexion impossible.

```json
{
    "message" : "Nom d'utilisateur ou mot de passe incorrect."
}
```



## Gestion des dossiers `/api/folders`

### Créer un dossier

Création directe du dossier sur la mémoire du serveur. Authentification requise, droits selon le chemin d'accès requis.

​	**URL :** `/api/folders/create`

​	**Methode :** `POST`

#### Paramètres

- `user_token` - *Jeton assocé à l'utilisateur*
  **Requis :** Utilisateur connecté


- `disk` - *Volume contenant les fichiers du serveur*
  **Requis :** Volume existant et connecté au serveur


- `folder` - *Chemin d'accès du répertoire, facultatif*
  **Requis :** Chemin d'accès existant et correct
- `folder_name` - *Nom du dossier à créer*
  **Requis :** [1 - 15 string]

#### Succès

​	**Conditions :** Toutes les conditions sont correctes et remplies.

​	**Code :** `200 OK`

#### Erreurs

​	**Condition :** Le chemin d'accès est incorrect.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** 

```json
{
    "message" : "Le chemin d'accès est incorrect."
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```



### Supprimer un dossier

Suppression directe du dossier et de son contenu sur la mémoire du serveur. Authentification requise, droits selon le chemin d'accès requis.

​	**URL :** `/api/folders/delete`

​	**Methode :** `DELETE`

#### Paramètres

- `user_token` - *Jeton assocé à l'utilisateur*
  **Requis :** Utilisateur connecté


- `disk` - *Volume contenant les fichiers du serveur*
  **Requis :** Volume existant et connecté au serveur


- `folder` - *Chemin d'accès du répertoire, facultatif*
  **Requis :** Chemin d'accès existant et correct

#### Succès

​	**Conditions :** Toutes les conditions sont correctes et remplies.

​	**Code :** `200 OK`

#### Erreurs

​	**Condition :** Le dossier n'existe pas, chemin d'accès incorrect.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** 

```json
{
    "message" : "Le dossier n'existe pas ou le chemin d'accès est incorrect."
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```



### Renommer un dossier

Renommer directement un fichier présent sur le serveur. Authentification et droits sur le fichier obligatoires.

​	**URL :** `/api/folders/rename`

​	**Methode :** `PUT`

#### Paramètres

- `user_token` - *Jeton assocé à l'utilisateur*
  **Requis :** Utilisateur connecté


- `disk` - *Volume contenant les fichiers du serveur*
  **Requis :** Volume existant et connecté au serveur


- `folder` - *Chemin d'accès du répertoire, facultatif*
  **Requis :** Chemin d'accès existant et correct
- `old_folder_name` - *Ancien nom du dossier à renommer*
  **Requis :** Dossier existant et nom correct
- `new_folder_name` - *Nouveau nom du dossier à renommer*
  **Requis :** [1 - 32 string], nom correct

#### Succès

​	**Conditions :** Toutes les conditions sont correctes et remplies.

​	**Code :** `200 OK`

​	**Exemple de réponse :**

```json
{
    "message" : "Le dossier a été renommé"
}
```



#### Erreurs

​	**Condition :** Le dossier n'existe pas, chemin d'accès incorrect.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** 

```json
{
    "message" : "Le dossier n'existe pas ou le chemin d'accès est incorrect."
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```



## Gestion des fichiers `/api/files`

### Demande de téléversement

Demande d'adresse pour téléversement d'un fichier. Authentification obligatoire.

​	**URL :** `/api/files/upload/request`

​	**Methode :** `POST`

#### Paramètres

- `user_token` - *Jeton associé à un utilisateur de la base de données*
  **Requis :** Utilisateur connecté

* `disk` - *Volume contenant les fichiers du serveur*
   **Requis :** Volume existant et connecté au serveur

* `folder` - *Chemin d'accès du fichier à téléverser*
   **Requis :** Chemin existant

* `file_name` - *Nom du fichier à téléverser*
   **Requis :** Nom de fichier correcte


#### Succès

​	**Condition :** Toutes les conditions sont correctes et remplies.

​	**Code :** `200 OK`

​	**Exemple de réponse :** Demande de téléversement effectuée, fichier prêt a être téléversé.

```json
{
    "upload_token" : "a8415rz2e31qdgds53z12aer8e"
}
```

#### Erreurs

​	**Condition :** Le fichier n'existe pas, chemin d'accès incorrect.

​	**Code :** `400 BAD REQUEST`

​		**Exemple de réponse :** 

```json
{
    "message" : "Le fichier n'existe pas ou le chemin est incorrect."
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```



### Téléverser un fichier

Téléversement d'un fichier sur le serveur via la demande de téléversement `/api/files/upload/request`. Authentification obligatoire.

​	**URL :** `/api/files/upload/{TOKEN}`

​	**Methode :** `POST`

#### Paramètres

Aucun paramètres requis.

#### Succès

​	**Condition :** Toutes les conditions sont correctes et remplies.

​	**Code :** `200 OK`

#### Erreurs

​	**Condition :** Jeton invalide.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** 

```json
{
    "message" : "Jeton de téléversement invalide"
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```



### Demande de téléchargement

Demande d'adresse pour téléchargement d'un fichier. Authentification et droits sur le fichier obligatoires.

​	**URL :** `/api/files/download/request`

​	**Methode :** `GET`

#### Paramètres

- `user_token` - *Jeton assocé à l'utilisateur*
  **Requis :** Utilisateur connecté


- `disk` - *Volume contenant les fichiers du serveur*
  **Requis :** Volume existant et connecté au serveur

- `folder` - *Chemin d'accès du fichier à télécharger*
   **Requis :** Chemin d'accès existant et correct
- `file_name` - *Nom du fichier à télécharger*
   **Requis :** Fichier existant et nom correct
- `timeout` - *Durée de vie du lien*
   **Requis :** [int]

#### Succès

​	**Conditions :** Toutes les conditions sont correctes et valides.

​	**Code :** `200 OK`

​	**Exemple de réponse :** 

```json
{
    "download_token" : "78461zters6d8g435df2e"
}
```

#### Erreurs

​	**Conditions :** Le fichier n'existe pas, chemin d'accès incorrect.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :**

```json
{
    "message" : "Le fichier n'existe pas ou le répertoire est incorrect."
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```



### Télécharger un fichier

Téléchargement d'un fichier présent sur le serveur via la demande de téléchargement `/api/files/download/request`

​	**URL :** `/api/files/download/{TOKEN}`

​	**Methode :** `GET`

#### Paramètres

Aucun paramètres requis.

#### Succès

​	**Conditions :** Toutes les conditions sont correctes et remplies.

​	**Code :** `200 OK`

#### Erreurs

​	**Condition :** Jeton invalide.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** 

```json
{
    "message" : "Jeton de téléchargement invalide"
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```



### Supprimer un fichier

Suppression directe du fichier sur la mémoire du serveur. Authentification et droits sur le fichier obligatoires.

​	**URL :** `/api/files/delete`

​	**Methode :** `DELETE`

#### Paramètres

- `user_token` - *Jeton assocé à l'utilisateur*
  **Requis :** Utilisateur connecté


- `disk` - *Volume contenant les fichiers du serveur*
  **Requis :** Volume existant et connecté au serveur


- `folder` - *Chemin d'accès du fichier à supprimer*
  **Requis :** Chemin d'accès existant et correct
- `file_name` - *Nom du fichier à supprimer*
  **Requis :** Fichier existant et nom correct

#### Succès

​	**Conditions :** Toutes les conditions sont correctes et remplies.

​	**Code :** `200 OK`

​	**Exemple de réponse :**

```json
{
    "message" : "Le fichier a été supprimé"
}
```



#### Erreurs

​	**Condition :** Le fichier n'existe pas, chemin d'accès incorrect.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** 

```json
{
    "message" : "Le fichier n'existe pas ou le chemin d'accès est incorrect."
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```



### Renommer un fichier

Renommer directement un fichier présent sur le serveur. Authentification et droits sur le fichier obligatoires.

​	**URL :** `/api/files/rename`

​	**Methode :** `PUT`

#### Paramètres

- `user_token` - *Jeton assocé à l'utilisateur*
  **Requis :** Utilisateur connecté


- `disk` - *Volume contenant les fichiers du serveur*
  **Requis :** Volume existant et connecté au serveur


- `folder` - *Chemin d'accès du fichier à renommer*
  **Requis :** Chemin d'accès existant et correct
- `old_file_name` - *Ancien nom du fichier à renommer*
  **Requis :** Fichier existant et nom correct
- `new_file_name` - *Nouveau nom du fichier à renommer*
  **Requis :** [1 - 32 string], nom correct

#### Succès

​	**Conditions :** Toutes les conditions sont correctes et remplies.

​	**Code :** `200 OK`

​	**Exemple de réponse :**

```json
{
    "message" : "Le fichier a bien été renommé"
}
```



#### Erreurs

​	**Condition :** Le fichier n'existe pas, chemin d'accès incorrect.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** 

```json
{
    "message" : "Le fichier n'existe pas ou le chemin d'accès est incorrect."
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```



### Gestion des périphériques `/api/devices`

#### Lister les périphériques

Liste les périphériques connectés au serveur. Authentification requise.

**URL :** `/api/devices/list`

​	**Methode :** `GET`

#### Paramètres

- `user_token` - *Jeton assocé à l'utilisateur*
  **Requis :** Utilisateur connecté

#### Succès

​	**Conditions :** Toutes les conditions sont correctes et remplies.

​	**Code :** `200 OK`

​	**Exemple de réponse :**

```json
{
    "devices" : [{
        "name" : "Clé USB",
        "storage" : 8000,
        "system_name" : "F:"
    },
                 {
        "name" : "Clé USB2",
        "storage" : 16000,
        "system_name" : "D:"
    }]
}
```



#### Erreurs

​	**Condition :** Aucun périphérique connecté.

​	**Code :** `400 BAD REQUEST`

​	**Exemple de réponse :** 

```json
{
    "message" : "Il n'y a aucun périphérique connecté au serveur."
}
```

​	**Condition :** Utilisateur non connecté.

​	**Code :** `401 UNAUTHORIZED`

​		**Exemple de réponse :**

```json
{
    "message" : "Une authentification est requise pour effectuer cette action."
}
```

