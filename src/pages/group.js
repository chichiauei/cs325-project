import React, { Component } from 'react';
import { Card, Input, Button, message } from 'antd'
import axios from "axios";
var moment = require('moment');
const { Search } = Input;

class Group extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            userId: JSON.parse(localStorage.getItem('user')).uid
        };
    }
    componentWillMount = () => {
        this.getList();
    }
    getList = () => {
        axios.get('/groups')
            .then((response) => {
                console.log(response.data)
                response.data.forEach(element => {
                    element.meetingTime = [
                        moment(element.meetingTime[0]).format('yyyy-MM-DD HH:mm'),
                        moment(element.meetingTime[1]).format('yyyy-MM-DD HH:mm')
                    ]
                });
                this.setState({
                    groups: response.data
                })
            })
            .catch(function (error) {
                console.log(error);
                message.error('group data fail');
            });
    }

    onSearch = value => {
        axios.post('/groups/search', { name: value })
            .then((response) => {
                response.data.data.forEach(element => {
                    element.meetingTime = [
                        moment(element.meetingTime[0]).format('yyyy-MM-DD HH:mm'),
                        moment(element.meetingTime[1]).format('yyyy-MM-DD HH:mm')
                    ]
                });
                this.setState({
                    groups: response.data.data
                })
            })
            .catch(function (error) {
                console.log(error);
                message.error('search fail');
            });
    }
    joinClick = (id, list) => {
        axios.put('/groups/' + id, { id: id, groupUser: [...list, JSON.parse(localStorage.getItem('user')).uid] })
            .then((response) => {
                message.success('join success');
                this.getList();
            })
            .catch(function (error) {
                console.log(error);
                message.error('join fail');
            });
    }
    render() {
        const { groups, userId } = this.state
        return (
            <div>
                <div style={{ width: '85%', margin: '5% auto', display: 'flex', flexFlow: 'row' }}>
                    <div style={{ flex: 1 }}><Search placeholder="input search text" size="large" onSearch={this.onSearch} enterButton style={{ width: 400, }} /></div>
                    <Button type="primary" shape="round" size='large' onClick={() => { window.location.href = '/createGroup' }}>Create own Group</Button>
                </div>
                <Card style={{ width: '85%', margin: '5% auto' }}>
                    {groups && groups.length ?
                        groups.map((item) => (
                            <Card
                                style={{ marginBottom: 24 }}
                                type="inner"
                                key={item.uid}
                                title={item.name + '-' + item.courseCode+'- ('+item.groupUser.length+')'}
                                extra={<a style={{ display: item.createUserId == userId || item.groupUser.indexOf(userId) > -1 ? 'none' : 'inline-block' }} onClick={this.joinClick.bind(this, item.uid, item.groupUser)}>JOIN</a>}
                            >
                                <p>Focus & Goal : {item.goal}</p>
                                <p>Meeting Time : {item.meetingTime[0] + ' - '+ item.meetingTime[1]}</p>
                                <p>Meeting Location : {item.meetingLocation}</p>
                                <p>Description : {item.Description}</p>
                            </Card>
                        ))
                        : <p style={{textAlign:'center'}}>no data</p>
                    }
                </Card>
            </div>
        )
    }
};

export default Group;