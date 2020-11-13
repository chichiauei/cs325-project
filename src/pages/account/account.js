import React, { Component } from 'react';
import { Avatar, Divider, Menu, message } from 'antd';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import GroupList from './groupList';
import Meeting from './meeting';
import Profile from './Profile';
import Announcements from './Announcements';
import { UserOutlined } from '@ant-design/icons';
import axios from "axios";

const { SubMenu } = Menu;

class Group extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            groups: [],
            openKey: '1'
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        axios.get('/groups')
            .then((response) => {
                console.log(response.data)
                var list = []
                response.data.forEach(element => {
                    if (element.createUserId == this.state.user.uid) {
                        list.push(element)
                    }
                });
                console.log(list)
                this.setState({
                    groups: list
                })
            })
            .catch(function (error) {
                console.log(error);
                message.error('group data fail');
            });
    }
    handleClick = e => {
        console.log('click ', e);
        this.setState({
            openKey: e.key
        })
    };

    render() {
        const { user, openKey } = this.state
        return (
            <BrowserRouter>
                <div style={{ display: 'flex', flexFlow: 'row', width: '85%', margin: '5% auto' }}>
                    <div style={{ width: '200px', marginRight: 24 }}>
                        <Avatar shape="square" size={64} icon={<UserOutlined />} />
                        <p style={{ fontSize: '18px', fontWeight: '700', marginTop: '12px', }}>{user.name}</p>
                        <Divider />
                        <Menu onClick={this.handleClick} style={{ background: 'none' }} defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">My Groups</Menu.Item>
                            <Menu.Item key="2">My Meetings</Menu.Item>
                            <Menu.Item key="3">Announcements</Menu.Item>
                            <Menu.Item key="4">Profile</Menu.Item>
                        </Menu>
                    </div>
                    <div style={{ flex: 1 }}>
                        {
                            openKey == '1' ? <GroupList></GroupList> : null
                        }
                         {
                            openKey == '2' ? <Meeting></Meeting> : null
                        }
                         {
                            openKey == '3' ? <Announcements></Announcements> : null
                        }
                        {
                            openKey == '4' ? <Profile></Profile> : null
                        }
                    </div>
                </div>
            </BrowserRouter>
        )
    }
};

export default Group;