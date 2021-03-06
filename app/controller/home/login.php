<?php
    /**
     * 用户登录接口
     * http://localhost:63342/2020-HUC-SE-php-practicum/app/controller/home/login.php
     *
     * parameters:
     *     post: username, password
     * return:
     *     user_id and is_admin in session
     *     err_code,
     *     err_info
     */

    require_once '../../lib/common.php';
    require_once getRootPath() . '/app/mapper/UserMapper.php';

    use app\mapper\UserMapper;

    function check(UserMapper $userMapper) {
        if (isset($_POST['username']) && isset($_POST['password'])) {
            return $userMapper->exists($_POST['username'], $_POST['password']);
        }
        return false;
    }

    if ($_POST) {
        $userMapper = new UserMapper;
        if (check($userMapper)) {
            $userId = $userMapper->getUserId($_POST['username'], $_POST['password']);
            $_SESSION['user_id'] = $userId;
            if ($userMapper->isAdmin($userId)) {
                $_SESSION['is_admin'] = true;
                echo json_encode([
                    'err_code' => 0,
                    'err_info' => 'admin',
                ]);
            } else {
                echo json_encode([
                    'err_code' => 0,
                    'err_info' => 'user',
                ]);
            }
        } else {
            echo json_encode([
                'err_code' => 2,
                'err_info' => '用户名或密码错误',
            ]);
        }
    } else {
        echo json_encode([
            'err_code' => 1,
            'err_info' => '验证码错误',
        ]);
    }