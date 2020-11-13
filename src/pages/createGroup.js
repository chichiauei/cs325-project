import React, { Component } from 'react';
import { Form, Input, Button, message, DatePicker } from 'antd';
import axios from "axios";
const { RangePicker } = DatePicker;

class CreateGroup extends Component {
    onFinish = values => {
        console.log('Received values of form: ', values);
        values.groupUser = [JSON.parse(localStorage.getItem('user')).uid];
        values.createUserId = JSON.parse(localStorage.getItem('user')).uid;
        values.meetingUser = [JSON.parse(localStorage.getItem('user')).uid]
        axios.post('/group/save', values)
            .then(function (response) {
                message.success('create success');
                window.location.href = '/group'
            })
            .catch(function (error) {
                console.log(error);
                message.error('create fail');
            });
    };
    render() {
        const config = {
            rules: [{ required: true, message: 'Please select time!' }],
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        };
        return (
            <div style={{ margin: '5% auto', width: '50%' }}>
                <h1 class='title'>Create Your Own Group</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    {...formItemLayout}
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                    >
                        <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                        name="courseCode"
                        label="Course Code"
                    >
                        <Input placeholder="Course Code" />
                    </Form.Item>
                    <Form.Item
                        name="goal"
                        label="Focus Goal"
                    >
                        <Input placeholder="Focus Goal" />
                    </Form.Item>
                    <Form.Item
                        name="meetingTime"
                        label="Meeting Time"
                        {...config}
                    >
                        <RangePicker showTime />
                    </Form.Item>
                    <Form.Item
                        name="meetingLocation"
                        label="Meeting Location"
                    >
                        <Input placeholder="Meeting Location" />
                    </Form.Item>
                    <Form.Item name="Description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 12, offset: 8 },
                        }}
                    >
                        <Button type="primary" htmlType="submit" >Create</Button>
                        <Button type="primary" style={{ display: 'inline-block', marginLeft: 12 }} onClick={() => window.location.href = '/group'}>Back</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
};

export default CreateGroup;