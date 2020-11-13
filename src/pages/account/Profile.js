import React from 'react';
import { Card, Input, message, Select, Modal, List, Form, Button, DatePicker } from 'antd'
import axios from "axios";
var moment = require('moment');
const { Option } = Select;


class Profile extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            initValue: {},
        };
    }


    componentDidMount = () => {
        this.users();
    }


    users = () => {
        console.log(JSON.parse(localStorage.getItem('user')))
        axios.get('/users/' + JSON.parse(localStorage.getItem('user')).uid,{id:JSON.parse(localStorage.getItem('user')).uid})
            .then((response) => {
                console.log(response)
                this.formRef.current.setFieldsValue({
                    // sex: response.data.sex,
                    major: response.data.major,
                    schoolYear: response.data.schoolYear,
                    Description: response.data.Description,
                })
            })
            .catch(function (error) {
                console.log(error);
                message.error('get user data fail');
            });
    }

    leaveClick = () => {

    }
    onFinish = values => {
        console.log('Received values of form: ', values);
        axios.put('/users/' + JSON.parse(localStorage.getItem('user')).uid,
            {
                id: JSON.parse(localStorage.getItem('user')).uid,
                // sex: values.sex,
                major: values.major,
                schoolYear: values.schoolYear,
                Description: values.Description,
            })
            .then((response) => {
                message.success('change success');
                this.users();
            })
            .catch(function (error) {
                console.log(error);
                message.error('change fail');
            });
    };
    render() {
        const { data, } = this.state
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
            <div>
                <Card
                    style={{ width: '100%' }}
                >
                    <Card bordered={false}>
                        <Form
                            name="normal_login"
                            ref={this.formRef}
                            className="login-form"
                            {...formItemLayout}
                            onFinish={this.onFinish}
                        >
                            {/* <Form.Item
                                name="sex"
                                label="Gender"
                                rules={[{ required: true, message: 'Please input your gender!' }]}
                            >
                                <Select placeholder="Gender" >
                                    <Option value="1">male</Option>
                                    <Option value="2">Female</Option>
                                </Select>
                            </Form.Item> */}
                            <Form.Item
                                name="major"
                                label="Major"
                                rules={[{ required: true, message: 'Please input your major!' }]}
                            >
                                <Input placeholder="Major" />
                            </Form.Item>
                            <Form.Item
                                name="schoolYear"
                                label="schoolYear"
                                rules={[{ required: true, message: 'Please input your School year!' }]}
                            >
                                <Input placeholder="School year" />
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
                                <Button type="primary" htmlType="submit" >Change</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Card>
            </div>
        )
    }
};

export default Profile;