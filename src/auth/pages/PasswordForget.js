import { Button, Form, Icon, Input } from 'antd';
import React, { Component } from 'react';
import { byPropKey } from '../../shared/utils';
import { passwordReset } from '../api/auth';
import { EMAIL_ERROR_TYPES } from '../constants';

const INITIAL_STATE = {
    email: '',
    error: null,
    emailInputErr: {
        status: '',
        message: '',
    },
};

class PasswordForgetScreen extends Component {
    state = { ...INITIAL_STATE };

    async handleSubmit(event) {
        event.preventDefault();

        const { email } = this.state;
        this.resetEmailInputErr();

        this.props.onSubmit(email).catch((error) => {
            this.setState(byPropKey('error', error.message));
        });

        return passwordReset(email);
    }

    resetEmailInputErr = () => {
        this.setState(
            byPropKey('emailInputErr', {
                status: '',
                message: '',
            })
        );
    };

    handleEmailInputBlur = (event) => {
        this.setState(
            byPropKey('emailInputErr', {
                status: EMAIL_ERROR_TYPES.INVALID.STATUS,
                message: EMAIL_ERROR_TYPES.INVALID.MESSAGE,
            })
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { error } = this.state;

        return (
            <div className="form-container">
                <h1 className="title">Password Forget</h1>
                <Form onSubmit={(event) => this.handleSubmit(event)} className="login-form">
                    <Form.Item
                        validateStatus={this.state.emailInputErr.status}
                        help={this.state.emailInputErr.message}
                    >
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Please input your email!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Email"
                                onChange={(event) =>
                                    this.setState(byPropKey('email', event.target.value))
                                }
                                onBlur={(event) => this.handleEmailInputBlur(event)}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button  type="primary" htmlType="submit" className="login-form-button">
                            Restore
                        </Button>
                    </Form.Item>

                    <div className="error-message">{error}</div>
                </Form>
            </div>
        );
    }
}

export default Form.create()(PasswordForgetScreen);
