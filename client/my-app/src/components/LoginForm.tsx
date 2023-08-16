import React, { FC, useState } from 'react';

const LoginForm: FC = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    return (
        <div>
            <input
                type="text"
                onChange={e => setEmail(e.target.value)}
                placeholder='Email'
                value={email}
            />
            <input
                type="password"
                onChange={e => setPassword(e.target.value)}
                value={password}
                placeholder='Пароль'
            />
            <button>Login</button>
            <button>Registration</button>
        </div>
    );
};

export default LoginForm;
