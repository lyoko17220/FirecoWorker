/* eslint-disable indent */
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
	 * Affichage du contenu d'un dossier
	 *
	 * @param path Chemin relatif
	 */
	function displayFolderContent(path) {
		console.log(path);
        if(path == null){
            path = '';
        }
		$.ajax({
			url: '/api/folders/content/' + document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1'),
			type: 'POST',
			data: {
				folder: path,
			},
			dataType: 'json',
			success: function (data) {
				//console.log(data);
				for (let j in data.content) {
					if (data.content[j].type === 'folder') {
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
	function linksForDashboard(){
		$('.material-icons.btn-success.btn-lg.m-2.p-1').on('click', function () {
			const path = $(this).attr('data-location');
			const filename = $(this).attr('data-filename');
			});


        $('.material-icons.btn-danger.btn-lg.m-2.p-1').on('click', function () {
            console.log('ok');
            const path = $(this).attr('data-location');
            const filename = $(this).attr('data-filename');
            $.ajax({
                url: '/api/files/delete/' + document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1'),
                type: 'POST',
                dataType: 'json',
                data: {
                    path: path,
                    file_name: filename,
                },
                success: function () {
                    $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					<span> Le fichier `+ filename+` a bien été supprimé.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                    $('tbody').empty();
                    dashbord(path);
                },
                error: function () {
                    $('#alert').html(`<div id="alert" class="alert alert-dismissable alert-success fade show" >
					<span> Le fichier `+filename +` n'a pas pu etre supprimé.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
                },
            });

        });

	}

	let currentPath = '/';

    function navigationFolder(){
        $('.material-icons.btn').on('click', function () {
            const path = $(this).attr('data-location');
            const filename = $(this).attr('id');
            currentPath = path + '/'+filename;
            $('tbody').empty();
            displayFolderContent(currentPath);
        });
    }


	/**
	 * Si on est loggé sur la page du dashboard
	 */
	if ($('#filetable').length === 1) {
		console.log(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1') !== '');
		if (document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1') !== '') {
			displayFolderContent();

			if (window.history && window.history.pushState) {

				window.history.pushState('forward', null, './#forward');

				$(window).on('popstate', function() {
					if (currentPath !== '/'){
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
         * Création d'une structure de dossier
         *
         * @param name
         * @param location
         */
	function displayFolder(name, location) {
		const output = '<tr data-location=' + location + `>
                <td class="col-4">
                    <i class="material-icons btn"  data-location="` + location + '" id="'+ name +'" >folder</i>' + name + `
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
                            <button class="material-icons btn-info btn-lg m-2 p-1">info</button>
                            <button class="material-icons btn-success btn-lg m-2 p-1" data-location="`+location+'" data-filename="'+ name+`">file_download</button>
                            <button class="material-icons btn-primary btn-lg m-2 p-1">mode_edit</button>
                            <button class="material-icons btn-danger btn-lg m-2 p-1"   data-location="` + location + '" data-filename="'+ name+`">delete</button>
                        </div>
                    </nav>
                </td>


            </tr>`;

		$('tbody').append(output);
	}

	function generateTopFolder(path){
		const anchor = $('.breadcrumb.navbar-dark.bg-dark');
		anchor.empty();

		let split = path.split('/');
		split[0] = 'Home';


		for (let i = 0; i < split.length - 1 ; i++) {
			anchor.append('<li class="breadcrumb-item"><a href="#">'+split[i]+'</a></li>');
		}

		anchor.append('<li class="breadcrumb-item active" aria-current="page">'+split.slice(-1).pop()+'</li>');
	}

});
