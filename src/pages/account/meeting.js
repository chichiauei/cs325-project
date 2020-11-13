import React from 'react';
import { Card, Input, message, Skeleton , List, Form, Button, DatePicker } from 'antd'
import axios from "axios";
var moment = require('moment');
const { Search } = Input;


class Meeting extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            userId: JSON.parse(localStorage.getItem('user')).uid,
            user: JSON.parse(localStorage.getItem('user')),
            tabList: [
                {
                    key: 'key1',
                    tab: 'This Week’s Meetings',
                },
                {
                    key: 'key2',
                    tab: 'Next Week’s Meetings',
                },
            ],
            key: 'key1',
            data: [],
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
        let weekOfday = parseInt(moment().format('d')) //今天是这周第几天 周日为一周中的第一天
        let end = new Date(moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD')).getTime() // 周日日期
        axios.get('/groups')
            .then((response) => {
                var list = []
                response.data.forEach(element => {
                    if (new Date(moment(element.meetingTime).format('yyyy-MM-DD HH:mm')).getTime() <= end) {
                        element.isWeek = true
                    } else {
                        element.isWeek = false
                    }
                    element.userTotal = element.meetingUser.length
                    element.meetingTime = [
                        moment(element.meetingTime[0]).format('yyyy-MM-DD HH:mm'),
                        moment(element.meetingTime[1]).format('yyyy-MM-DD HH:mm')
                    ]
                    if (element.createUserId == this.state.user.uid || element.groupUser.indexOf(this.state.user.uid) > -1) {
                        list.push(element)
                    }
                });
                console.log(list)
                this.setState({
                    data: list
                })
            })
            .catch(function (error) {
                console.log(error);
                message.error('group data fail');
            });
    }

    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({key:key})
    };
    joinClick = (id, list) => {
        axios.put('/groups/' + id, { id: id, meetingUser: [...list, JSON.parse(localStorage.getItem('user')).uid] })
            .then((response) => {
                message.success('join success');
                this.getList();
            })
            .catch(function (error) {
                console.log(error);
                message.error('join fail');
            });
    }
    cancelClick= (id, list) => {
        axios.put('/groups/' + id, { id: id, status:'cancel' })
            .then((response) => {
                message.success('cancel success');
                this.getList();
            })
            .catch(function (error) {
                console.log(error);
                message.error('cancel fail');
            });
    }
    render() {
        const { tabList, key, data, userId } = this.state
        const config = {
            rules: [{ type: 'object', message: 'Please select time!' }],
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
                    activeTabKey={key}
                    onTabChange={key => {
                        this.onTabChange(key, 'key');
                    }}
                >
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item
                                style={{display:key=='key1'?(item.isWeek?'block':'none'):(item.isWeek?'none':'block')}}
                            >
                                <div style={{display:'flex',flexFlow:'row'}}>
                                   <p style={{color:'orange',display:item.status =='open' ? 'none' : 'inline-block',marginRight:'12px'}}>[ CANCEL ] </p> {item.name}
                                    <p style={{marginLeft:32}}>{item.userTotal}</p><p style={{marginLeft:32}}>{item.meetingTime[0]+'-'+item.meetingTime[1]}</p><p style={{marginLeft:32}}>{item.meetingLocation}</p>
                                <p style={{textAlign:'right',flex:1}}>
                                    <a style={{ display: (item.createUserId != userId && item.meetingUser.indexOf(userId) == -1) && item.status =='open' ? 'inline-block' : 'none',marginRight:'12px' }} onClick={this.joinClick.bind(this, item.uid, item.meetingUser)}>JOIN</a>
                                <a style={{ display: item.createUserId == userId && item.status =='open' ? 'inline-block' : 'none' }}  onClick={this.cancelClick.bind(this, item.uid)}>CANCEL</a></p></div> 
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        )
    }
};

export default Meeting;