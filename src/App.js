import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { Layout, Menu, Dropdown, Button } from 'antd';
//home
import HomePage from './pages/home/index';
//登录注册
import Login from './pages/user/login'
import Register from './pages/user/register'
//group
import Group from './pages/group'
import CreateGroup from './pages/createGroup'
//account
import Account from './pages/account/account'
import styles from './App.less';
import logoUrl from './img/logo2.png'
const { Header, Content } = Layout


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    this.setState({
      user: JSON.parse(localStorage.getItem('user'))
    })
  }

  onMenuClick = (event) => {
    const { key } = event;
    if (key === 'logout') {
      console.log("1222")
      localStorage.clear();
      window.location.href = '/login'
    }

  };


  render() {
    const { user } = this.state
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="App">
        <Layout style={{ display: 'flex', flexFlow: 'column', minHeight: '100vh' }}>
          <Header style={{ background: '#A3DCCD', display: 'flex', flexFlow: 'row' }}>
            <div style={{ flex: 1, textAlign: 'left', }}>
              <img alt="" style={{ width: '150px', marginTop: '-40px' }} src={logoUrl} />
            </div>
            <div>
              {
                user ?
                  <div>
                    <Button type="link" onClick={() => { window.location.href = '/group' }}>GROUP</Button>
                    <Button type="link" onClick={() => { window.location.href = '/account' }}>ACCOUNT</Button>
                    <Dropdown overlay={menuHeaderDropdown}>
                      <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        {user.name} <DownOutlined />
                      </a>
                    </Dropdown>
                  </div>
                  :
                  <div>
                    <Button type="link" onClick={() => { window.location.href = '/login' }}>SIGN IN</Button>
                    <Button type="link" onClick={() => { window.location.href = '/register' }}>SIGN UP</Button>
                  </div>
              }
            </div>
          </Header>
          <Content style={{ flex: 1 }}>
            <BrowserRouter>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/group" component={Group} />
                <Route exact path="/account" component={Account} />
                <Route exact path="/createGroup" component={CreateGroup} />
              </Switch>
            </BrowserRouter>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
