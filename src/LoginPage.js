import React from "react";
import './App.css';
import axios from "axios";
import GamblingSystem from "./GamblingSystem";
import Cookies from "universal-cookie";
import AllBets from "./AllBets";

class LoginPage extends React.Component {
    state = {
        id: -1,
        username: '',
        password: '',
        changePassword: '',
        email: '',
        balance: '',
        mail: '',
        tab: 'login',
        errorCode: null,
        info: null,
        connected: false,
        user: null,
        betAmount: '',
    }

    page = {
        gamblingPage: 1,
        betPage: 2,
        allBetsPage: 3,
        currentPage: 1,
        changeDetails: 4,
    };

    componentDidMount() {
        let{cookies}=this.state
         cookies = new Cookies();
        const connected = cookies.get('connected');
        if (connected) {
            const user = cookies.get('user');
            const username = cookies.get('username');
            const password = cookies.get('password');
            const id = cookies.get('id');
            this.setState({ username, password, user, connected: true, id });
        }
    }

    login = () => {
        const { username, password } = this.state;

        if (!username || !password) {
            this.setState({ errorCode: "Username and password are required." });
            return;
        }

        axios.post("http://localhost:9124/login?username=" + username + "&password=" + password).then(response => {
            if (response.data.success) {
                const cookies = new Cookies();
                cookies.set('connected', true, { path: '/' });
                cookies.set('username', username, { path: '/' });
                cookies.set('password', password, { path: '/' });
                cookies.set('user', response.data.user, { path: '/' });
                cookies.set('id', response.data.user.id, { path: '/' });
                this.setState({
                    connected: true,
                    user: response.data.user,
                    id: response.data.user.id,
                });
            } else {
                const errorCode = response.data.errorCode;
                this.setState({
                    errorCode: errorCode
                });
            }
        }).catch(error => {
            console.error("Login error:", error);
        });
    }

    disconnect = () => {
        const cookies = new Cookies();
        cookies.set('connected', false, { path: '/' });
        this.page.currentPage=this.page.gamblingPage;
        this.setState({
            id: -1,
            username: '',
            password: '',
            changePassword: '',
            email: '',
            balance: '',
            mail: '',
            tab: 'login',
            errorCode: null,
            info: null,
            connected: false,
            user: null,
            betAmount: '',
            cookies:null
        });
    }

    register = () => {
        const { username, password, email } = this.state;

        axios.post("http://localhost:9124/register?username=" + username + "&password=" + password + "&email=" + email).then(response => {
            if (response.data.success) {
                this.login();
            } else {
                this.setState({ errorCode: response.data.errorCode });
            }
        }).catch(error => {
            console.error("Registration error:", error);
        });
    }

    inputChange = (key, event) => {
        this.setState({
            [key]: event.target.value,
            errorCode: null
        });
    }

    empty = () => {
        this.setState({ username: "", password: "", email: "", info: null });
    }

    selectTab = (tab) => {
        this.setState({ tab, errorCode: null });
        this.empty();
    }

    loginPage = () => {
        const { username, password, email, tab, errorCode } = this.state;
        if (!this.state.connected) {
            return (
                <div className="LoginPage">
                    <div className="login-container">
                        <div className="login-headline">Login or Register</div>
                        <div className="tab-buttons">
                            <button className={tab === 'login' ? 'connection-buttons active' : 'connection-buttons'} onClick={() => this.selectTab('login')}>Login</button>
                            <button className={tab === 'register' ? 'connection-buttons active' : 'connection-buttons'} onClick={() => this.selectTab('register')}>Register</button>
                        </div>
                        <div className="margin-button">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(event) => this.inputChange("username", event)}
                            />
                        </div>
                        {tab === 'register' && (
                            <div className="margin-button">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(event) => this.inputChange("email", event)}
                                />
                            </div>
                        )}
                        <div className="margin-button">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(event) => this.inputChange("password", event)}
                            />
                        </div>

                        <button className={"connection-buttons margin-top"} type="button" onClick={tab === 'login' ? this.login : this.register}>{tab === 'login' ? 'Login' : 'Register'}</button>
                        {errorCode && (
                            <div className="error-message margin-top">{this.error()}</div>
                        )}
                    </div>
                </div>
            );
        } else {
            this.page.currentPage = this.page.changeDetails;
            this.setState({});
        }
    }

    error = () => {
        if (this.state.password.length === 0 || this.state.username.length === 0 || (this.state.email.length === 0 && this.state.tab === "register")) {
            return "Fill all fields";
        }
        switch (this.state.errorCode) {
            case 1:
                return "No such username";
            case 2:
                return "Wrong password";
            case 4:
                return "Username is taken";
            case 5:
                return "Wrong username or password";
            case 6:
                return "Username doesn't exist";
            case 9:
                return "Weak password";
            case 10:
                return "Wrong email";
            default:
                return "Unknown error";
        }
    }

    mainScreen = () => {
        if(!this.state.connected){
            return this.loginPage();
        }
        let toReturn;
        switch (this.page.currentPage) {
            case this.page.gamblingPage:
                toReturn = <GamblingSystem user={this.state.user} />;
                break;
            case this.page.betPage:
                toReturn = this.gamblingForm();
                break;
            case this.page.allBetsPage:
                toReturn = <AllBets user={this.state.user} />;
                break;
            case this.page.changeDetails:
                toReturn = this.changeDetails();
                break;
            default:
                toReturn = null;
                break;
        }
        return (
            <div>
                {this.navigationButtons()}
                <div className={"absolute"}>{toReturn}</div>
            </div>
        );
    }
    lineDown = () => {
        return <br />
    }
    navigationButtons = () => {
        return (
            <div>
                <button onClick={() => { this.disconnect() }} className={"text disconnect"}>Disconnect</button>
                <table className={"margin-top"}>
                    <tr>
                        <th>
                            <button className={"black text margin bounds gold-background"} onClick={() => {
                                this.page.currentPage = this.page.changeDetails
                                this.setState({ betAmount: '' });
                            }}>Change Details</button>
                        </th>
                        <th>
                            <button className={"black text margin bounds gold-background"} onClick={() => {
                                this.page.currentPage = this.page.allBetsPage
                                this.setState({ betAmount: '' });
                            }}>All Bets</button>
                        </th>
                        <th>
                            <button className={"black text margin bounds gold-background"} onClick={() => {
                                this.page.currentPage = this.page.gamblingPage
                                this.setState({ betAmount: '' });
                            }}>Gambling</button>
                        </th>

                    </tr>
                </table>
            </div>
        );
    }
    changeDetails = () => {
        const {username, password, id, balance, email} = this.state.user;
        return <div>
            <div className={"headline"}>Account Details</div>
            <table className={"thin-table center"}>
                <h2>Details:</h2>
                <h3>ID: {id}</h3>
                <h3>username: {username}</h3>
                <h3>password: {password}</h3>
                <h3>balance: {balance.toLocaleString()}</h3>
                <h3>mail: {email}</h3>
            </table>
            <table className={"thin-table center"}>
                <div className="margin-button">
                    <h1>change details</h1>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={this.state.changePassword}
                        onChange={(event) => this.inputChange("changePassword", event)}
                    />
                </div>
                <div className="margin-button">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={this.state.mail}
                        onChange={(event) => this.inputChange("mail", event)}/>
                </div>
                <button onClick={() => {
                    this.updateDetails()
                }} className={"gamble-form-button button-higher"}>confirm
                </button>
                <div className={"red"}>{this.state.errorCode !== null ? this.state.errorCode : ''}</div>

            </table>
        </div>
    }
    updateDetails = () => {
        const { id} = this.state.user;

        // בדיקת תקינות עבור המייל והסיסמה
        if (!this.isValidEmail(this.state.mail)) {
            this.setState({ errorCode: "Invalid email format" });
            return;
        }
        if (this.state.changePassword.length < 4) {
            this.setState({ errorCode: "Password must be at least 4 characters long" });
            return;
        }

        const address = "http://localhost:9124/update-details?id=" + id + "&password=" + this.state.changePassword + "&newEmail=" + this.state.mail;

        axios.post(address).then(response => {
            this.setState({
                changePassword:'',
                mail:'',
                user:response.data,
            });
            let{cookies}=this.state;
            cookies=new Cookies();
            cookies.set('connected', true, { path: '/' });
            cookies.set('username', response.data.username, { path: '/' });
            cookies.set('password', response.data.password, { path: '/' });
            cookies.set('user', response.data, { path: '/' });
            cookies.set('id', response.data.id, { path: '/' });
            this.setState({cookies: cookies})
        }).catch(error => {
            this.setState({
                errorCode: error.message // סיבת השגיאה במקרה של כישלון
            });
        });
    };

    // פונקציה לבדיקת תקינות האימייל
    isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    render() {
        return this.mainScreen()
    }
}

export default LoginPage;
