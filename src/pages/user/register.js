import React, { Component } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from "axios";
const { Option } = Select;

class Register extends Component {
    onFinish = values => {
        console.log('Received values of form: ', values);
        axios.post('/user/register', values)
            .then(function (response) {
                console.log(response)
                if (response.data.errorCode === -1) {
                    message.error('register fail,email is exist');
                } else {
                    message.success('register success');
                    window.location.href = '/login'
                }
            })
            .catch(function (error) {
                console.log(error);
                message.error('register fail');
            });
    };
    render() {
        return (
            <div style={{ margin: '5% auto', width: '350px' }}>
                <h1 className='title'>Sign up</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true,type:'email', message: 'Please input your email!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input placeholder="Name" />
                    </Form.Item>
                    {/* <Form.Item
                        name="sex"
                        rules={[{ required: true, message: 'Please input your gender!' }]}
                    >
                        <Select placeholder="Gender" >
                            <Option value="1">male</Option>
                            <Option value="2">Female</Option>
                        </Select>
                    </Form.Item> */}
                    <Form.Item
                        name="major"
                        rules={[{ required: true, message: 'Please input your major!' }]}
                    >
                        <Input placeholder="Major" />
                    </Form.Item>
                    <Form.Item
                        name="schoolYear"
                        rules={[{ required: true, message: 'Please input your School year!' }]}
                    >
                        <Input placeholder="School year" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">Create</Button>
                        <p style={{ marginTop: 24 }}>have an account?Please <a href="/login">sign in</a> here</p>
                    </Form.Item>
                </Form>
            </div>
        )
    }
};

export default Register;