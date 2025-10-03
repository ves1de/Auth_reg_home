// Проверка авторизации
if (window.location.pathname.includes('home.html') || window.location.pathname.includes('profile.html')) {
    var user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'auth.html';
    }
}

// Авторизация
if (document.getElementById('authForm')) {
    document.getElementById('authForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        var login = document.getElementById('login').value;
        var password = document.getElementById('password').value;
        var message = document.getElementById('message');
        
        var formData = new FormData();
        formData.append('action', 'login');
        formData.append('login', login);
        formData.append('password', password);
        
        fetch('../back/auth_reg.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                message.className = 'message success';
                message.style.display = 'block';
                message.textContent = 'Успешный вход!';
                setTimeout(function() {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                message.className = 'message error';
                message.style.display = 'block';
                message.textContent = data.message;
            }
        })
        .catch(error => {
            message.className = 'message error';
            message.style.display = 'block';
            message.textContent = 'Ошибка соединения';
        });
    });
}

// Регистрация
if (document.getElementById('regForm')) {
    document.getElementById('regForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        var name = document.getElementById('name').value;
        var login = document.getElementById('login').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var message = document.getElementById('message');
        
        var formData = new FormData();
        formData.append('action', 'register');
        formData.append('name', name);
        formData.append('login', login);
        formData.append('email', email);
        formData.append('password', password);
        
        fetch('../back/auth_reg.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                message.className = 'message success';
                message.style.display = 'block';
                message.textContent = 'Регистрация успешна! Перенаправление...';
                setTimeout(function() {
                    window.location.href = 'auth.html';
                }, 2000);
            } else {
                message.className = 'message error';
                message.style.display = 'block';
                message.textContent = data.message;
            }
        })
        .catch(error => {
            message.className = 'message error';
            message.style.display = 'block';
            message.textContent = 'Ошибка соединения';
        });
    });
}

// Отображение данных пользователя на главной (БЕЗ ЛОГИНА)
if (document.getElementById('userInfo')) {
    var user = JSON.parse(localStorage.getItem('user'));
    var userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = '<p><strong>Имя:</strong> ' + user.name + '</p>' +
                        '<p><strong>Email:</strong> ' + user.email + '</p>';
}

// Отображение профиля (БЕЗ ЛОГИНА)
if (document.getElementById('profileCard')) {
    var user = JSON.parse(localStorage.getItem('user'));
    var profileCard = document.getElementById('profileCard');
    profileCard.innerHTML = '<div class="profile-item">' +
                           '<label>Имя</label>' +
                           '<p>' + user.name + '</p>' +
                           '</div>' +
                           '<div class="profile-item">' +
                           '<label>Email</label>' +
                           '<p>' + user.email + '</p>' +
                           '</div>' +
                           '<div class="profile-item">' +
                           '<label>Дата регистрации</label>' +
                           '<p>' + user.date + '</p>' +
                           '</div>';
}

// Выход
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = 'auth.html';
    });
}

