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
			data:{
				username: $('#username').val(),
				password: $('#password').val(),
			},
			dataType: 'json',
			success: function (data) {
				console.log(data);
				document.cookie = 'token=' + data.token;
				document.location('dashboard');
			},
			error: function (data) {
				$('#alert').html(`<div id="alert" class="alert alert-dismissable alert-danger fade show" >
					<span> Le nom d'utilisateur ou le mot de passe ne correspond pas.</span>
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>`);
			}
		});
	});

});