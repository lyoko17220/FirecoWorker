$(document).ready(function () {
    $("#sign").click(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/users/sign',
            type: 'POST',
            data: {
                username: $("#username").val(),
                password: $("#password").val(),
                firstname: $("#firstname").val(),
                lastname: $("#lastname").val()

            }

        });
    });

    $("#login").click(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/users/login',
            type: 'POST',
            data:{
                username: $("#username").val(),
                password: $("#password").val(),
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
            },
            error: function (data) {
                $("#alert").html('<div id="alert" class="alert alert-dismissable alert-danger  fade show" > <span> '+ "Le nom d'utilisateur ou le mot de passe ne correspond pas. " +'</span><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>')
                console.log(data);

            }
        })

    })

});