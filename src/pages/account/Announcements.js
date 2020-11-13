import React from 'react';
import { Card, Input, message, Modal, List, Form, Button, DatePicker } from 'antd'
import axios from "axios";
var moment = require('moment');
const { Search } = Input;
const { RangePicker } = DatePicker;


class Announcements extends React.Component {
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
                console.log(this.state.user.uid)
                var tabList = []
                var dataList = []
                response.data.forEach(element => {
                    if (element.createUserId == this.state.user.uid || element.groupUser.indexOf(this.state.user.uid) > -1) {
                        tabList.push({
                            key: element.uid,
                            tab: element.name,
                        })
                        dataList.push(element)
                    }
                });
                this.setState({
                    groups: dataList,
                    tabList: tabList,
                    key: tabList && tabList.length ? tabList[0].key : null,
                    data: dataList && dataList.length ? dataList[0] : {},
                })
            })
            .catch(function (error) {
                console.log(error);
                message.error('group data fail');
            });
    }

    onTabChange = (key, type) => {
        console.log(key, type);
        console.log(this.state.groups)
        var data = {}
        this.state.groups.forEach(element => {
            if (element.uid == key) {
                console.log("选中：")
                console.log(element)
                data = element
            }
        });
        this.setState({ [type]: key, data: data, });
    };
    leaveClick = () => {
        var groupUser = this.state.data.groupUser.filter(item => item != this.state.user.uid)
        axios.put('/groups/' + this.state.data.uid,
            {
                id: this.state.data.uid,
                groupUser: groupUser,
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
    render() {
        const { tabList, groups, key, data, initValue } = this.state
        const config = {
            rules: [{ message: 'Please select time!' }],
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
                        data.uid && data.status == 'cancel' &&
                        <Card title="Meeting Cancelled">
                            this group's Meeting Cancelled
                        </Card>
                    }
                </Card>
            </div>
        )
    }
};

export default Announcements;