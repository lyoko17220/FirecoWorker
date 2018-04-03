/* eslint-disable indent */
$(document).ready(function () {

    // Token value console.log(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    const log = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

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
        //document.location = '/view/dashboard';
    });

    /**
     * Deconnexion
     */
    $('#logout').click(function (e) {
        e.preventDefault();
        document.cookie = 'token=';
        document.location.href = ('home');
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
            error: function () {
                $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-danger fade show" >
					<span> Le nom d'utilisateur ou le mot de passe ne correspond pas.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
            }
        });
    });


    /**
     * Si on est loggé sur la page du dashboard
     */
    if ($('#filetable').length === 1) {
        console.log(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1') !== '');
        if (document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1') !== '') {
            displayFolderContent();

            if (window.history && window.history.pushState) {

                window.history.pushState('forward', null, '');

                $(window).on('popstate', function () {
                    if (currentPath !== '/') {
                        let newPath = currentPath;
                        newPath = newPath.split('/');
                        newPath.pop();
                        currentPath = newPath.join('/');
                        displayFolderContent(currentPath);
                    } else {
                        history.back();
                    }
                });

            }
        }
        else
            document.location.href = ('https://www.theuselesswebindex.com/error/');
    }

    /**
     * Affichage du contenu d'un dossier
     *
     * @param path Chemin relatif
     */
    function displayFolderContent(path) {
        console.log(path);
        if (path == null) {
            path = '';
        }
        $.ajax({
            url: '/api/folders/content/' + log,
            type: 'POST',
            data: {
                folder: path,
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                for (let j in data.content) {
                    if (data.content[j].type === 'folder') {
                        if (data.content[j].path === '')
	                        data.content[j].path = '/';
                        displayFolder(data.content[j].name, data.content[j].path);
                    }
                    else {
                        displayFile(data.content[j].name, data.content[j].path);
                    }
                }
                navigationFolder();
                linksForDashboard();
                generateTopFolder(currentPath);
            }
        });
    }


    /**
     * Liens pour les boutons du tableau de fichier
     */
    function linksForDashboard() {
        $('.material-icons.btn-success.btn-lg.m-2.p-1').on('click', function () {
            const path = $(this).attr('data-location');
            const filename = $(this).attr('data-filename');
            console.log(path);
        });
    }

    let currentPath = '/';

    function navigationFolder() {
        $('.material-icons.btn').on('click', function () {
            const path = $(this).attr('data-location');
            const filename = $(this).attr('id');
            currentPath = path + '/' + filename;
            $('tbody').empty();
            displayFolderContent(currentPath);
        });

        $('.material-icons.btn-danger.p-1.btn-lg.m-2.deleteFile').on('click', function () {
            const path = $(this).attr('data-location');
            const filename = $(this).attr('data-name');
            console.log(filename);
            console.log(path);
            $.ajax({
                url: '/api/files/delete/' + log,
                type: 'POST',
                dataType: 'json',
                data: {
                    path: path,
                    file_name: filename,
                },
                success: function () {
                    $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					<span> Le fichier ` + filename + ` a bien été supprimé.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                    $('tbody').empty();
                    displayFolderContent(path);
                },
                error: function () {
                    $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					<span> Le fichier ` + filename + ` n'a pas pu etre supprimé.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                },
            });

        });

        $('.material-icons.btn-success.btn-lg.m-2.p-1.downloadFile').on('click', function () {
	        const path = $(this).attr('data-location');
	        const filename = $(this).attr('data-name');

	        console.log ('P' + path + ' -- ' +filename);

			$.ajax({
               url: '/api/files/download/request/' + log,
                type: 'POST',
                dataType: 'json',
                data: {
                    folder: currentPath,
                    filename: filename,
                },
                success: function (data) {
                   console.log(data);
                   window.location.href = '/api/files/download/' + log + '/' + data.token;
				},
				error: function () {
					$('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					<span> Le fichier ` + filename + ` n'a pas pu être téléchargé.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
				},
            });
		});

        $('.material-icons.btn-primary.btn-lg.m-2.p-1.editFile').on('click', function () {
            const path = $(this).attr('data-location');
            const oldName = $(this).attr('data-name');
            $('#change').on('click', function () {
                const newName = $('#newName').val();
                console.log(newName);
                console.log(path);
                console.log(oldName);
                $.ajax({
                    url: '/api/files/rename/' + log,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        path: path,
                        file_name: oldName,
                        new_file_name: newName
                    },
                    success: function () {
                        $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					    <span> Le fichier ` + oldName + ` a bien été renommé.</span>
					    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                        $('tbody').empty();
                        displayFolderContent(path);
                        document.location.reload();

                    },
                    error: function () {
                        $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					    <span> Le fichier ` + oldName + ` n'a pas pu etre renommé.</span>
					    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                    }
                });

            });
        });

        $('.material-icons.btn-primary.btn-lg.m-2.p-1.editFolder').on('click', function () {
            const path = $(this).attr('data-location');
            const oldName = $(this).attr('data-name');
            $('#change').on('click', function () {
                const newName = $('#newName').val();
                console.log(newName);
                console.log(path);
                console.log(oldName);
                $.ajax({
                    url: '/api/folders/rename/' + log,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        path: path,
                        folderName: oldName,
                        newName: newName
                    },
                    success: function () {
                        $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					    <span> Le dossier ` + oldName + ` a bien été renommé.</span>
					    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                        $('tbody').empty();
                        displayFolderContent(path);
                        document.location.reload();

                    },
                    error: function () {
                        $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					    <span> Le dossier ` + oldName + ` n'a pas pu etre renommé.</span>
					    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                    }
                });

            });
        });


        $('.material-icons.btn-danger.p-1.btn-lg.m-2.deleteFolder').on('click', function () {
            const path = $(this).attr('data-location');
            const foldername = $(this).attr('data-name');
            $.ajax({
                url: '/api/folders/delete/' + log,
                type: 'POST',
                dataType: 'json',
                data: {
                    path: path,
                    folderName: foldername,
                },
                success: function () {
                    $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					<span> Le dossier ` + foldername + ` a bien été supprimé.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                    $('tbody').empty();
                    displayFolderContent(path);
                },
                error: function () {
                    $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					<span> Le dossier ` + foldername + ` n'a pas pu etre supprimé.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                },
            });

        });

      

    }



    /**
     * Création d'une structure de dossier
     *
     * @param name
     * @param location
     */
    function displayFolder(name, location) {
        const output = '<tr data-location=' + location + `>
                <td class="col-4">
                    <i class="material-icons btn"  data-location="` + location + '" id="' + name + '" >folder</i>' + name + `
                </td>

                <td class=" col-1">
                    <nav class="navbar navbar-expand-lg navbar-expand-xl navbar-expand-md">
                        <button class="navbar-toggler material-icons btn-info btn-lg m-2 p-1"
                                data-toggle="collapse"
                                data-target="#groupBtnBis" aria-controls="groupBtnBis" aria-expanded="false"
                                aria-label="Toggle navigation">list
                        </button>

                        <div class="collapse navbar-collapse" id="groupBtnBis">
                            <!--<button class="material-icons btn-info btn-lg m-2 p-1">info</button>!-->
                            <button class="material-icons btn-primary btn-lg m-2 p-1 editFolder"  data-toggle="modal" data-target="#exampleModal" data-name="` + name + '" data-location="' + location + `" >mode_edit</button>
                            <button class="material-icons btn-danger p-1 btn-lg m-2 deleteFolder" data-location="` + location + '" data-name="' + name + `" >delete</button>
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
    function displayFile(name, location) {

        let output = `<tr>
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
                           <!--<button class="material-icons btn-info btn-lg m-2 p-1">info</button>!-->
                            <button class="material-icons btn-success btn-lg m-2 p-1 downloadFile"  data-name="` + name + '" data-location="' + location + `"  >file_download</button>
                            <button class="material-icons btn-primary btn-lg m-2 p-1 editFile"   data-toggle="modal" data-target="#exampleModal" data-name="` + name + '" data-location="' + location + `" >mode_edit</button>
                            <button class="material-icons btn-danger btn-lg m-2 p-1 deleteFile" data-location="` + location + '" data-name="' + name + `" >delete</button>
                        </div>
                    </nav>
                </td>


            </tr>`;

        $('tbody').append(output);
    }

    function generateTopFolder(path) {
        const anchor = $('.breadcrumb.navbar-dark.bg-dark');
        anchor.empty();

        let split = path.split('/');
        split[0] = 'Home';


        for (let i = 0; i < split.length - 1; i++) {
            anchor.append('<li class="breadcrumb-item"><a href="#">' + split[i] + '</a></li>');
        }

        anchor.append('<li class="breadcrumb-item active" aria-current="page">' + split.slice(-1).pop() + '</li>');
    }

});
