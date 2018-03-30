$(document).ready(function () {

        // Token value console.log(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1'));

        /**
         * Inscription
         */
        $('#sign').click(function (e) {
            e.preventDefault();
            $.ajax({
                url: '/api/users/sign',
                type: 'POST',
                data: {
                    username: $('#username').val(),
                    password: $('#password').val(),
                    firstname: $('#firstname').val(),
                    lastname: $('#lastname').val()
                }
            });
        });

        /**
         * Connexion
         */
        $('#login').click(function (e) {
            e.preventDefault();
            $.ajax({
                url: '/api/users/login',
                type: 'POST',
                data: {
                    username: $('#username').val(),
                    password: $('#password').val(),
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    document.cookie = 'token=' + data.token;
                    document.location.href = ('dashboard');
                },
                error: function (data) {
                    $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-danger fade show" >
					<span> Le nom d'utilisateur ou le mot de passe ne correspond pas.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                }
            });
        });
addFile(dashbord());
        function dashbord() {

            $.ajax({
                url: '/api/folders/content/' + document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1'),
                type: 'POST',
                data: {
                    folder: '',
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    for (let i in data) {
                        let doc = data[i];
                        for (let j in doc) {
                            if (doc[j].type == 'folder') {
                                $('#table').append('<tr> <td class="col-4"><i class="material-icons btn">folder</i>' + doc[j].name +
                                    '</td><td class=" col-1"><nav class="navbar navbar-expand-lg navbar-expand-xl navbar-expand-md">' +
                                    '<button class="navbar-toggler material-icons btn-info btn-lg m-2 p-1" data-toggle="collapse" ' +
                                    'data-target="#groupBtnBis" aria-controls="groupBtnBis" aria-expanded="false" aria-label="Toggle navigation">list </button>' +
                                    '<div class="collapse navbar-collapse" id="groupBtnBis"><button class="material-icons btn-info btn-lg m-2 p-1">info</button>' +
                                    '<button class="material-icons btn-primary btn-lg m-2 p-1">mode_edit</button>' +
                                    '<button class="material-icons btn-danger btn-lg m-2 p-1">delete</button></div></nav></td></tr>');
                            }
                            else {
                                $('#table').append('<tr> <td class="col-4"><i class="material-icons btn">insert_drive_file</i>' + doc[j].name +
                                    '</td><td class=" col-1"><nav class="navbar navbar-expand-lg navbar-expand-xl navbar-expand-md">' +
                                    '<button class="navbar-toggler material-icons btn-info btn-lg m-2 p-1" data-toggle="collapse" ' +
                                    'data-target="#groupBtnBis" aria-controls="groupBtnBis" aria-expanded="false" aria-label="Toggle navigation">list </button>' +
                                    ' <div class="collapse navbar-collapse" id="groupBtn"> ' +
                                    '<button class="material-icons btn-info btn-lg m-2 p-1">info</button> ' +
                                    '<button class="material-icons btn-success btn-lg m-2 p-1">file_download</button> ' +
                                    '<button class="material-icons btn-primary btn-lg m-2 p-1">mode_edit</button> ' +
                                    '<button class="material-icons btn-danger btn-lg m-2 p-1">delete</button> ' +
                                    '</div></nav></td></tr>');

                            }
                        }
                    }
                }
            })
        }


        let location = '/';

        if ($('#filetable').length === 1) {
            addFile('Le nom magique', 'lien où ça pointe');
            createFolder('FOLDER MAGIQUE', 'ok');
        }


        /**
         * Création d'une structure de dossier
         *
         * @param name
         * @param location
         */
        function createFolder(name, location) {
            const output = `<tr data-location=` + location + `>
                <td class="col-4">
                    <i class="material-icons btn">folder</i>` + name + `
                </td>

                <td class=" col-1">
                    <nav class="navbar navbar-expand-lg navbar-expand-xl navbar-expand-md">
                        <button class="navbar-toggler material-icons btn-info btn-lg m-2 p-1"
                                data-toggle="collapse"
                                data-target="#groupBtnBis" aria-controls="groupBtnBis" aria-expanded="false"
                                aria-label="Toggle navigation">list
                        </button>

                        <div class="collapse navbar-collapse" id="groupBtnBis">
                            <button class="material-icons btn-info btn-lg m-2 p-1">info</button>
                            <button class="material-icons btn-primary btn-lg m-2 p-1">mode_edit</button>
                            <button class="material-icons btn-danger btn-lg m-2 p-1">delete</button>
                        </div>
                    </nav>

                </td>
            </tr>`;

            $('tbody').append(output);
        }

        /**
         * Création d'une structure de fichier
         *
         * @param name
         * @param location
         */
        function addFile(name, location) {

            let output = '<tr data-location=' + location + `>
                <td class="col-4">
                    <i class="material-icons btn ">insert_drive_file</i>` + name + `
                </td>

                <td class=" col-1">
                    <nav class="navbar navbar-expand-lg navbar-expand-xl navbar-expand-md">
                        <button class="navbar-toggler material-icons btn-info btn-lg m-2 p-1"
                                data-toggle="collapse"
                                data-target="#groupBtn" aria-controls="groupBtn" aria-expanded="false"
                                aria-label="Toggle navigation">list
                        </button>
                        <div class="collapse navbar-collapse" id="groupBtn">
                            <button class="material-icons btn-info btn-lg m-2 p-1">info</button>
                            <button class="material-icons btn-success btn-lg m-2 p-1">file_download</button>
                            <button class="material-icons btn-primary btn-lg m-2 p-1">mode_edit</button>
                            <button class="material-icons btn-danger btn-lg m-2 p-1">delete</button>
                        </div>
                    </nav>
                </td>


            </tr>`;

            $('tbody').append(output);

        }

    }
);