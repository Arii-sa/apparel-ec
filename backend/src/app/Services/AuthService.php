<?php

namespace App\Services;

use App\Exceptions\InvalidCredentialsException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * 新規ユーザーを登録し、APIトークンを発行する。
     *
     * @return array{user: User, token: string}
     */
    public function register(string $name, string $email, string $password): array
    {
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);

        $user->refresh();
        
        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * メールアドレス・パスワードで認証し、APIトークンを発行する。
     *
     * @return array{user: User, token: string}
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw new InvalidCredentialsException('メールアドレスまたはパスワードが正しくありません。');
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }
}