import axios from 'axios';
import React, { useState } from 'react';
import './styles.css'; // Import your CSS file

const Form1 = () => {
    const [Logindata, setLogindata] = useState({
        "username":"",
        "password":""
    })

    const handleLogin = () => {
        axios.post('http://localhost:9000/login/getlogins', Logindata).then((res) => {
            if (res.data === null) {
                alert('User Not Found')
            } else if (res.data === false) {
                alert('Invalid Password')
            } else {
                localStorage.setItem('user', Logindata.username);
                alert(localStorage.getItem('user'))
                window.location.href='/'
            }
        })
    }

    return (
        <center>
            <div className="login-container">
                <div className="form-container">
                    <h2 style={{fontWeight: 'bold', marginBottom: '20px'}}>Login</h2>
                    <label htmlFor="username" style={{fontWeight: 'bold', marginBottom: '5px'}}>Username:</label>
                    <input type="text" id="username" name="username" value={Logindata.username} onChange={(e) => setLogindata({...Logindata, username: e.target.value})} required />
                    <label htmlFor="password" style={{fontWeight: 'bold', marginBottom: '5px'}}>Password:</label>
                    <input type="password" id="password" name="password" value={Logindata.password} onChange={(e) => setLogindata({...Logindata, password: e.target.value})} required />
                    <button onClick={handleLogin} style={{ background: '#ffff99', padding: '10px 20px', borderRadius: '5px', border: 'none', marginTop: '20px', cursor: 'pointer' }}>Login</button>
                </div>
            </div>
        </center>
    );
};

export default Form1;
