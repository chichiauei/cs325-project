import React, { Component } from 'react';
import { Layout } from 'antd';

import jpg1 from './../../img/1.jpg'
import jpg2 from './../../img/2.jpg'
import jpg3 from './../../img/3.jpg'
const {Footer } = Layout

class Homepage extends Component {
    render() {
        return (
            <div>
                <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', fontSize: '85px' }}>WELCOME</h1>
                <Footer style={{ background: '#A3DCCD', position: 'fixed', bottom: 0, right: 0, left: 0, }}>
                    <div style={{ display: 'flex', flexFlow: 'row' }}>
                        <div style={{ flex: 1, textAlign: 'center', marginBottom: 24, fontWeight: 800 }}>Contact Us</div>
                        <div style={{ flex: 1, textAlign: 'center', marginBottom: 24, fontWeight: 800 }}>About</div>
                        <div style={{ flex: 1, textAlign: 'center', marginBottom: 24, fontWeight: 800 }}>Supoort</div>
                    </div>
                    <div style={{ display: 'flex', flexFlow: 'row' }}>
                        <div style={{ flex: 1, textAlign: 'center', marginBottom: 24, fontWeight: 800 }}>Email | abcde@gmail.com</div>
                        <div style={{ flex: 1, textAlign: 'center', marginBottom: 24 }}></div>
                        <div style={{ flex: 1, textAlign: 'center', marginBottom: 24, fontWeight: 800 }}>
                            <img alt="" style={{marginRight:'12px',width:'50px'}} src={jpg1}/>
                            <img alt="" style={{marginRight:'12px',width:'50px'}} src={jpg2}/>
                            <img alt="" style={{marginRight:'12px',width:'50px'}} src={jpg3}/>
                        </div>
                    </div>
                </Footer>
            </div>
        )
    }
};

export default Homepage;