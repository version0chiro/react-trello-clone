import { Button, Form, Icon, Input } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, provider } from '../../core/api/firebase';
import { actionTypes } from '../../core/api/reducer';
import { useStateValue } from '../../core/api/StateProvider';
import { BOARDS, LANDING, PASSWORD_FORGET, SIGN_UP } from '../../routes';
import { signInWithEmailAndPassword } from '../api/auth';
import { EMAIL_ERROR_TYPES } from '../constants';

import '../styles/auth.scss';

const SignInForm = ({ form }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [emailInputErr, setEmailInputErr] = useState({
        status: '',
        message: '',
    });
    const [, dispatch] = useStateValue();

    const signInWithGoogle = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                });
                window.location = BOARDS;
            })
            .catch((error) => alert(error.message));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const submitButton = document.querySelector('.login-form-button');
        setEmailInputErr({
            status: '',
            message: '',
        });

        submitButton.disabled = true;
        return await signInWithEmailAndPassword(email, password)
            .then(() => {
                submitButton.disabled = false;
                window.location = LANDING;
            })
            .catch((error) => {
                submitButton.disabled = false;
                setError(error.message);
            });
    };

    const handleEmailInputBlur = (event) => {
        setEmailInputErr({
            status: EMAIL_ERROR_TYPES.INVALID.STATUS,
            message: EMAIL_ERROR_TYPES.INVALID.MESSAGE,
        });
    };

    return (
        <div className="form-container">
            <h1>Sign In here</h1>

            <Form onSubmit={onSubmit}>
                <Form.Item validateStatus={emailInputErr.status} help={emailInputErr.message}>
                    {form.getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Please input your email!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Email"
                            onChange={(event) => setEmail(event.target.value)}
                            onBlur={handleEmailInputBlur}
                        />
                    )}
                </Form.Item>

                <Form.Item>
                    {form.getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            placeholder="Password"
                        />
                    )}
                </Form.Item>

                <Form.Item>
                    <div className="login-buttons">
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        or
                        <Button
                            type="danger"
                            htmlType="submit"
                            className="login-form-button"
                            onClick={signInWithGoogle}
                        >
                            Continue with Google
                        </Button>
                    </div>
                </Form.Item>

                <div className="error-message">{error}</div>
            </Form>
        </div>
    );
};

export const WrappedSignInForm = Form.create()(SignInForm);

const SignInPage = ({ history }) => (
    <div className="form-container">
        <WrappedSignInForm history={history} />
        <p>
            <Link to={PASSWORD_FORGET}>Forgot Password?</Link>
        </p>
        <p>
            Don't have an account? <Link to={SIGN_UP}>Sign Up</Link>
        </p>
    </div>
);

export default SignInPage;
