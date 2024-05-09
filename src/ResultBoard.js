import React from "react";
import axios from "axios";

class ResultBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            isLeaderChanged: false // Flag to track if the leader changed
        };
    }

    componentDidMount() {
        this.fetchData(); // Fetch data when component mounts
        this.interval = setInterval(this.fetchData, 1000); // Polling every 5 seconds
    }

    componentWillUnmount() {
        clearInterval(this.interval); // Stop polling when component unmounts
    }

    fetchData = () => {
        axios.get("http://localhost:9124/teams").then(response => {
            this.setState(prevState => {
                // Sort games by score
                const sortedTeams = response.data.slice().sort((a, b) => b.score - a.score);
                // Check if there's a change in positions
                const isLeaderChanged = prevState.teams.length > 0 && sortedTeams[0].id !== prevState.teams[0].id;
                // Update state with sorted games
                return {
                    teams: sortedTeams,
                    isLeaderChanged: isLeaderChanged
                };
            });
        });
    };

    render() {
        const { teams, isLeaderChanged } = this.state;
        return (
            <div className={"margin-top1 absolute"}>
                <div className={"headline"}>Result Board</div>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th className={"margin gold-background text"}>Name:</th>
                        <th className={"margin gold-background text"}>Power:</th>
                        <th className={"margin gold-background text"}>Score:</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map((team, index) => (
                        <tr key={team.id} style={{ backgroundColor: isLeaderChanged && index === 0 ? "yellow" : "transparent" }}>
                            <td className={"gold text"}>{team.name}</td>
                            <td className={"silver text"}>{team.power}</td>
                            <td className={"red text"}>{team.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ResultBoard;
