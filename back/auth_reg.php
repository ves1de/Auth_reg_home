<?php
header('Content-Type: application/json');

// Путь к файлу базы данных
$db_file = '../bd/bd.json';

// Получаем действие
$action = $_POST['action'];

// Читаем базу данных
if (file_exists($db_file)) {
    $db_content = file_get_contents($db_file);
    $users = json_decode($db_content, true);
    if (!$users) {
        $users = array();
    }
} else {
    $users = array();
}

// Регистрация
if ($action == 'register') {
    $name = $_POST['name'];
    $login = $_POST['login'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    // Проверка существования логина
    $login_exists = false;
    foreach ($users as $user) {
        if ($user['login'] == $login) {
            $login_exists = true;
            break;
        }
    }
    
    if ($login_exists) {
        echo json_encode(array('success' => false, 'message' => 'Логин уже занят'));
        exit;
    }
    
    // Проверка существования email
    $email_exists = false;
    foreach ($users as $user) {
        if ($user['email'] == $email) {
            $email_exists = true;
            break;
        }
    }
    
    if ($email_exists) {
        echo json_encode(array('success' => false, 'message' => 'Email уже зарегистрирован'));
        exit;
    }
    
    // Добавляем нового пользователя
    $new_user = array(
        'id' => count($users) + 1,
        'name' => $name,
        'login' => $login,
        'email' => $email,
        'password' => password_hash($password, PASSWORD_DEFAULT),
        'date' => date('Y-m-d H:i:s')
    );
    
    $users[] = $new_user;
    
    // Сохраняем в файл
    file_put_contents($db_file, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    echo json_encode(array('success' => true, 'message' => 'Регистрация успешна'));
}

// Авторизация
if ($action == 'login') {
    $login = $_POST['login'];
    $password = $_POST['password'];
    
    $user_found = null;
    
    // Ищем пользователя
    foreach ($users as $user) {
        if ($user['login'] == $login) {
            $user_found = $user;
            break;
        }
    }
    
    if (!$user_found) {
        echo json_encode(array('success' => false, 'message' => 'Неверный логин или пароль'));
        exit;
    }
    
    // Проверяем пароль
    if (password_verify($password, $user_found['password'])) {
        // Убираем пароль из данных
        unset($user_found['password']);
        
        echo json_encode(array(
            'success' => true,
            'message' => 'Вход выполнен',
            'user' => $user_found
        ));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Неверный логин или пароль'));
    }
}
?>