import React from "react";
import axios from "axios";
import CurrentGame from "./CurrentGame";
class AllBets extends React.Component {
state={
    activeBets: [],
    overBets: [],
    user:this.props.user
}
    componentDidMount() {
        this.fetchData();

        this.interval = setInterval(this.fetchData, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    fetchData = () => {
        const { username, password } = this.state.user;
        axios.get(`http://localhost:9124/get-active-bets?username=${username}&password=${password}`)
            .then(response => {
                this.setState({
                    activeBets: response.data,
                    isLoading: false
                });
            });
        axios.get(`http://localhost:9124/get-over-bets?username=${username}&password=${password}`)
            .then(response => {
                this.setState({
                    overBets: response.data,
                    isLoading: false
                });
            })
    };

    allBets = () => {
        return (
            <div>
                {this.lineDown}
                <CurrentGame/>
                <h1 className={"headline"}>Active Bets</h1>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th className={"margin gold-background text"}>Name:</th>
                        <th className={"margin gold-background text"}>Choice:</th>
                        <th className={"margin gold-background text"}>Betting Amount:</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.activeBets.map(bet => (
                        <tr key={bet.game.gameId}>
                            <td className={"gold text"}>{bet.game.home.name} vs {bet.game.guest.name}</td>
                            <td className={"silver text"}>  {bet.choice === 1 ? "Home" : bet.choice === 2 ? "Guest" : "Tie"}</td>
                            <td className={"gold text"}>{bet.bettingAmount.toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <h1 className={"headline"}>Over Bets</h1>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th className={"margin gold-background text"}>Name:</th>
                        <th className={"margin gold-background text"}>Choice:</th>
                        <th className={"margin gold-background text"}>Betting Amount:</th>
                        <th className={"margin gold-background text"}>Win:</th>
                        <th className={"margin gold-background text"}>Reward:</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.overBets.map(bet => (
                        <tr key={bet.game.gameId}>
                            <td className={"gold text"}>{bet.game.home.name} vs {bet.game.guest.name}</td>
                            <td className={"silver text"}>  {bet.choice === 1 ? "Home" : bet.choice === 2 ? "Guest" : "Tie"}</td>
                            <td className={"gold text"}>{bet.bettingAmount.toLocaleString()}</td>
                            <td className={"gold text"}>{bet.win ? 'Yes' : 'No'}</td>
                            <td className={"green text"}>{bet.win ? bet.reward.toLocaleString() : 0}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
    render() {
        return(<div>
            {this.allBets()}
        </div>);
    }
}
    export default AllBets;
