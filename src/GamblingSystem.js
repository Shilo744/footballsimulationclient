import React from "react";
import axios from "axios";

class GamblingSystem extends React.Component {
    state = {
        games: [],
        game: {},
        currentBet: {},
        betAmount: '',
        balance: '',
        selectedOption: 0,
        onBet:false,
    };



    componentDidMount() {
        this.fetchData();

        this.interval = setInterval(this.fetchData, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    fetchData = () => {
        const { username, password } = this.props.user;
        axios.get("http://localhost:9124/future-games").then(response => {
            this.setState({
                games: response.data
            });
        });
        axios.get("http://localhost:9124/game").then(response => {
            this.setState({
                game: response.data
            });
        })
        axios.get("http://localhost:9124/get-balance?username=" + username + "&password=" + password).then(response => {
            this.setState({ balance: response.data })
        });
    };

    lineDown = () => {
        return <br />
    }

    handleOptionChange = (event) => {
        this.setState({
            selectedOption: event.target.value
        });
    }

    gamblingForm = () => {
        let item = this.state.currentBet;
        return (
            <div>
                <div className={"headline"}>Ticket</div>
                <div className={"margin-top"}>
                    {this.showBalance()}
                </div>
                <div className={"text gambling-form"}>
                    <button onClick={()=>this.setState({onBet:false})} className={"x"}>X</button>
                    {this.lineDown()}
                    <div className={"headline"}>Place Your Bet</div>
                    <div>
                        {this.lineDown()}
                        <label>Bet Amount:</label>
                        <input
                            value={this.state.betAmount}
                            onChange={(event) => this.inputNumbers("betAmount", event)}
                        />
                    </div>
                    <div>
                        <label htmlFor="selectedTeam">Select Team:</label>
                        <select value={this.state.selectedOption} onChange={this.handleOptionChange}>
                            <option value="home">Home: {this.state.currentBet.home.name}</option>
                            <option value="guest">Guest: {this.state.currentBet.guest.name}</option>
                            <option value="tie">Tie</option>
                        </select>
                        <table className={"table no-frame"}>
                            {this.lineDown()}
                            <tr>
                                <td className={"gold text"}>{item.home.name}</td>
                                <td className={"red text"}>{this.calculateOdds(item.home.power, item.guest.power)}%</td>
                                <td className={"white text gold-background"}>{this.calculateProfit(item.home.power, item.guest.power)}%</td>
                            </tr>
                            {this.lineDown()}
                            <tr>
                                <td className={"silver text"}>{item.guest.name}</td>
                                <td className={"red text"}>{this.calculateOdds(item.guest.power, item.home.power)}%</td>
                                <td className={"white text gold-background"}>{this.calculateProfit(item.guest.power, item.home.power)}%</td>
                            </tr>
                            {this.lineDown()}
                            <tr>
                                <td className={"green text"}>Tie</td>
                                <td className={"red text"}>{this.calculateTieOdds(item.guest.power, item.home.power)}%</td>
                                <td className={"white text gold-background"}>{this.calculateTieProfit(item.guest.power, item.home.power)}%</td>
                            </tr>
                        </table>
                        <button className={"gamble-form-button"}
                                disabled={!(this.state.betAmount.length > 0 || this.state.betAmount > 0)}
                                onClick={() => { this.confirmBet() }}>Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    confirmBet = () => {
        let choice = 1;
        if (this.state.selectedOption === "guest") {
            choice = 2;
        } else if (this.state.selectedOption === "tie") {
            choice = 3;
        }

        axios.get("http://localhost:9124/make-bet?username=" + this.props.user.username + "&password=" + this.props.user.password +
            "&gameId=" + this.state.currentBet.gameId + "&amount=" + this.state.betAmount + "&choice=" + choice)
            .then(response => {
                if (response.data) {
                } else {
                    alert("bet fail");
                }
                this.setState({ betAmount: '',
                onBet:false});
            });
    }

    gamblingTables = () => {
        this.state.games = this.state.games.slice().sort((a, b) => b.id - a.id);
        let spot = 0;
        return (
            <div className={"margin-top1"}>
                <div className={"headline"}>Gambling System</div>
                {this.showBalance()}
                <table className={"table gambling"}>
                    <thead>
                    <tr>
                        <td className={"margin gold-background text"}>Start:</td>
                        <td className={"margin gold-background text"}>Home:</td>
                        <td className={"margin gold-background text"}>Win:</td>
                        <td className={"margin gold-background text"}>Profit:</td>
                        <td className={"margin gold-background text"}>Tie:</td>
                        <td className={"margin gold-background text"}>Profit:</td>
                        <td className={"margin gold-background text"}>Guest:</td>
                        <td className={"margin gold-background text"}>Win:</td>
                        <td className={"margin gold-background text"}>Profit:</td>
                        <td className={"margin gold-background text"}>Bet:</td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.games.map(item => (
                        <tr key={item.id}>
                            <td className={"green text"}>{this.timeToGame(spot++)}</td>
                            <td className={"gold text"}>{item.home.name}</td>
                            <td className={"red text"}>{this.calculateOdds(item.home.power, item.guest.power)}%</td>
                            <td className={"white text gold-background"}>{this.calculateProfit(item.home.power, item.guest.power)}%</td>
                            <td className={"red text"}>{this.calculateTieOdds(item.home.power, item.guest.power)}%</td>
                            <td className={"white text gold-background"}>{this.calculateTieProfit(item.guest.power, item.home.power)}%</td>
                            <td className={"silver text"}>{item.guest.name}</td>
                            <td className={"red text"}>{this.calculateOdds(item.guest.power, item.home.power)}%</td>
                            <td className={"white text gold-background"}>{this.calculateProfit(item.guest.power, item.home.power)}%</td>
                            <td className={"text"}>
                                <button onClick={() => { this.bet(item)}} className={"white  gamble-button"}>Bet
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
    timeToGame(spot){
        return this.state.game.currentTime + (30 * spot)

    }
    inputNumbers = (key, event) => {
        let value = event.target.value;
        if (value >= 0) {
            let newState = {
                [key]: value,
                errorCode: null
            };

            if (key === 'betAmount' && parseFloat(value) > parseFloat(this.state.balance)) {
                newState[key] = this.state.balance;
            }

            this.setState(newState);
        }
    }

    render() {
        return (this.state.onBet? this.gamblingForm():this.gamblingTables());
    }

    bet(item) {
        this.setState({ currentBet: item,
        onBet:true
        })
    }

    showBalance = () => {
        return (<div className={"balance green margin-top1"}>Balance: {(this.state.balance - this.state.betAmount).toLocaleString()}$</div>);
    }

    calculateOdds = (team1, team2) => {
        let tie = this.calculateTieOdds(team1, team2);
        let chance = ((team1 / (team1 + team2)) * 100) * ((100 - tie) / 100);
        return Math.round(chance);
    }

    calculateProfit = (team1, team2) => {
        return Math.round(100 / this.calculateOdds(team1, team2) * 100)
    }

    calculateTieOdds = (team1, team2) => {
        let totalPower = team1 + team2;
        let change = 35 - (100 / totalPower) * Math.abs(team1 - team2);
        if (change <= 5) {
            return 5;
        }
        return Math.round(change);
    }

    calculateTieProfit = (team1, team2) => {
        return Math.round(100 / this.calculateTieOdds(team1, team2) * 100)
    }
}

export default GamblingSystem;
