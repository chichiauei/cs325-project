import React from 'react';
import { Card, Input, message, Modal, List, Form, Button, DatePicker } from 'antd'
import axios from "axios";
var moment = require('moment');
const { Search } = Input;
const { RangePicker } = DatePicker;


class GroupList extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            groups: [],
            tabList: [],
            key: '',
            data: {},
            initValue: {},
            userList: []
        };
    }


    componentDidMount = () => {
        this.users();
    }
    users = () => {
        axios.get('/users').then((res) => {
            console.log(res.data)
            this.userList = res.data
            this.getList(null);
        })
    }

    getList = (key) => {
        axios.get('/groups')
            .then((response) => {
                console.log(response.data)
                var list = []
                var tabList = []
                console.log(this.state.user.uid)
                response.data.forEach((element, index) => {
                    console.log("createUserId:" + element.createUserId)
                    if (element.createUserId == this.state.user.uid || element.groupUser.indexOf(this.state.user.uid) > -1) {
                        if (element.createUserId == this.state.user.uid) {
                            element.userTotal = element.groupUser.length
                            element.isSelf = true
                        }else if (element.groupUser.indexOf(this.state.user.uid) > -1) {
                            element.userTotal = element.groupUser.length
                            element.isSelf = false
                        }
                        tabList.push({
                            key: element.uid,
                            tab: element.name,
                        })
                        list.push(element)
                    }
                });
                console.log(list)
                console.log(tabList)
                if (list && list.length) {
                    this.setState({
                        groups: list,
                        tabList: tabList,
                        data: list && list.length ? list[0] : {},
                    })
                    this.formRef.current.setFieldsValue({
                        goal: list[0].goal,
                        meetingTime: [
                            moment(moment(list[0].meetingTime[0]).format('yyyy-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
                            moment(moment(list[0].meetingTime[1]).format('yyyy-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss')
                        ],
                        meetingLocation: list[0].meetingLocation,
                        Description: list[0].Description,
                    })
                    if (!key) {
                        this.setState({
                            key: tabList && tabList.length ? tabList[0].key : null,
                        })
                    } else {
                        list.forEach(element => {
                            if (element.uid == key) {
                                console.log("选中：")
                                console.log(element)
                                this.setState({
                                    data: element,
                                })
                                this.formRef.current.setFieldsValue({
                                    goal: element.goal,
                                    meetingTime: [
                                        moment(moment(element.meetingTime[0]).format('yyyy-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
                                        moment(moment(element.meetingTime[1]).format('yyyy-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss')
                                    ],
                                    meetingLocation: element.meetingLocation,
                                    Description: element.Description,
                                })
                            }
                        });
                    }
                } else {
                    this.setState({
                        data: {},
                        key: null,
                        tabList: [],
                        groups: []
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
                message.error('group data fail');
            });
    }

    onTabChange = (key, type) => {
        console.log(key, type);
        this.state.groups.forEach(element => {
            if (element.uid == key) {
                console.log("选中：")
                console.log(element)
                this.setState({
                    data: element,
                })
                this.formRef.current.setFieldsValue({
                    goal: element.goal,
                    meetingTime: [
                        moment(moment(element.meetingTime[0]).format('yyyy-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
                        moment(moment(element.meetingTime[1]).format('yyyy-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss')
                    ],
                    meetingLocation: element.meetingLocation,
                    Description: element.Description,
                })
            }
        });
        this.setState({ [type]: key });
    };
    leaveClick = () => {
        var groupUser = this.state.data.groupUser.filter(item => item != this.state.user.uid)
        var meetingUser = this.state.data.meetingUser.filter(item => item != this.state.user.uid)
        axios.put('/groups/' + this.state.data.uid,
            {
                id: this.state.data.uid,
                groupUser: groupUser,
                meetingUser: meetingUser,
            })
            .then((response) => {
                message.success('leave success');
                this.users();
            })
            .catch(function (error) {
                console.log(error);
                message.error('leave fail');
            });
    }
    onFinish = values => {
        console.log('Received values of form: ', values);
        axios.put('/groups/' + this.state.data.uid,
            {
                id: this.state.data.uid,
                goal: values.goal,
                meetingTime: values.meetingTime,
                meetingLocation: values.meetingLocation,
                Description: values.Description,
            })
            .then((response) => {
                message.success('change success');
                this.getList(this.state.key);
            })
            .catch(function (error) {
                console.log(error);
                message.error('change fail');
            });
    };
    openUser() {
        var userData = [];
        this.state.data.groupUser.forEach(element => {
            this.userList.forEach(item => {
                if (element == item.uid) {
                    userData.push({
                        name: item.name,
                        sex: item.sex,
                        major: item.major
                    })
                }
            });
        });
        Modal.info({
            title: 'Group Members',
            content: (
                <div>
                    <List
                        bordered
                        dataSource={userData}
                        renderItem={item => (
                            <List.Item>
                                <div style={{ display: 'flex', flexFlow: 'row', width: '100%' }}>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <div>Name</div>
                                        <div>{item.name}</div>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <div>Major</div>
                                        <div>{item.major}</div>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            ),
            onOk() { },
        });
    }
    render() {
        const { tabList, groups, key, data, initValue } = this.state
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
                    tabList={tabList}
                    activeTabKey={this.state.key}
                    onTabChange={key => {
                        this.onTabChange(key, 'key');
                    }}
                >
                    {
                        data.uid ?
                            <Card title={data.name + ' - ' + data.courseCode} extra={<a onClick={this.openUser.bind(this)}>{data.userTotal}</a>} bordered={false}>
                                <Form
                                    name="normal_login"
                                    ref={this.formRef}
                                    className="login-form"
                                    {...formItemLayout}
                                    onFinish={this.onFinish}
                                >
                                    <Form.Item
                                        name="goal"
                                        label="Focus Goal"
                                    >
                                        <Input placeholder="Focus Goal" disabled={!data.isSelf} />
                                    </Form.Item>
                                    <Form.Item
                                        name="meetingTime"
                                        label="Meeting Time"
                                    >
                                        <RangePicker showTime disabled={!data.isSelf} />
                                    </Form.Item>
                                    <Form.Item
                                        name="meetingLocation"
                                        label="Meeting Location"
                                    >
                                        <Input placeholder="Meeting Location" disabled={!data.isSelf} />
                                    </Form.Item>
                                    <Form.Item name="Description" label="Description">
                                        <Input.TextArea disabled={!data.isSelf} />
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{
                                            xs: { span: 24, offset: 0 },
                                            sm: { span: 12, offset: 8 },
                                        }}
                                    >
                                        <Button type="primary" htmlType="submit" disabled={!data.isSelf}>Change</Button>
                                        <Button type="primary" style={{ display: !data.isSelf ? 'inline-block' : 'none', marginLeft: 12 }} danger onClick={this.leaveClick.bind(this)}>Leave</Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                            : <div style={{ textAlign: 'center', height: '50vh' }}>
                                <Button type="primary" shape="round" size='large' onClick={() => { window.location.href = '/createGroup' }}>Create own Group</Button>
                            </div>
                    }
                </Card>
            </div>
        )
    }
};

export default GroupList;