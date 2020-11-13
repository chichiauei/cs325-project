import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from "axios";


class Login extends Component {
    onFinish = values => {
        console.log('Received values of form: ', values);
        axios.post('/user/login', {
            name: values.username,
            password: values.password,
        })
            .then(function (response) {
                message.success('login success');
               localStorage.setItem('user', JSON.stringify(response.data.data))
                window.location.href = '/'
            })
            .catch(function (error) {
                console.log(error);
                message.error('login fail');
            });
    };
    render() {
        return (
            <div style={{ margin: '5% auto', width: '350px' }}>
                <h1 className='title'>Sign in</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">Login</Button>
                        <p style={{ marginTop: 24 }}>Don't have an account?Please <a href="/register">signup</a> here</p>
                    </Form.Item>
                </Form>
            </div>
        )
    }
};

export default Login;