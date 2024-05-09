import React from "react";
import axios from "axios";
import CurrentGame from "./CurrentGame";

class Games extends React.Component {
    state = {
        games: [],
    };

    componentDidMount() {
        this.fetchData(); // קריאה ראשונית לנתונים בזמן שהקומפוננטה מותקנת

        // קריאה לפונקציה לפי תדירות שנקבעה
        this.interval = setInterval(this.fetchData, 1000); // לדוגמה, מעדכן את הנתונים כל 5 שניות
    }

    componentWillUnmount() {
        clearInterval(this.interval); // עצירת הפונקציה בסיום חיי הקומפוננטה
    }

    fetchData = () => {
        // פונקציה המבצעת את קריאת הנתונים מהשרת ועדכון ה-state
        axios.get("http://localhost:9124/games").then(response => {
            this.setState({
                games: response.data
            });
        });
    };
    mainScreen=()=>{
        this.state.games=this.state.games.slice().sort((a, b) => b.id - a.id);

        return(
            <div className={"margin-top1 absolute"}>
                <CurrentGame/>

                <div className={"headline"}>Games History</div>
            <table className={"table"}>
                <thead>
                <tr>
                    <td className={"margin gold-background text"}>Home:</td>
                    <td className={"margin gold-background text"}>Result:</td>
                    <td className={"margin gold-background text"}>Guest:</td>
                    <td className={"margin gold-background text"}>Winner:</td>
                </tr>
                </thead>
                <tbody>
                {/* עדכון רשימת המשחקים */}
                {this.state.games.map(item => (
                    <tr key={item.id}>
                        <td className={"gold text"}>{item.home.name}</td>
                        <td className={"red text"}>{item.state}</td>
                        <td className={"silver text"}>{item.guest.name}</td>
                        <td className={"gold text"}>{item.winner}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>);
    }
    render() {
        return (
         this.mainScreen()
        );
    }
}

export default Games;
