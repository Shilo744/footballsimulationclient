import React from "react";
import axios from "axios";


class CurrentGame extends React.Component{
    state={
        game: {}
    }
    fetchData = () => {
        // פונקציה המבצעת את קריאת הנתונים מהשרת ועדכון ה-state

        axios.get("http://localhost:9124/game").then(response => {
            this.setState({
                game: response.data
            });
        });
    };
    componentDidMount() {
        this.fetchData(); // קריאה ראשונית לנתונים בזמן שהקומפוננטה מותקנת

        // קריאה לפונקציה לפי תדירות שנקבעה
        this.interval = setInterval(this.fetchData, 1000); // לדוגמה, מעדכן את הנתונים כל 5 שניות
    }

    componentWillUnmount() {
        clearInterval(this.interval); // עצירת הפונקציה בסיום חיי הקומפוננטה
    }
    render(){
        return(<div>
            <div className={"headline"}>Current Game</div>
            <table className={"table"}>
                <thead>
                <tr>
                    <td className={"margin gold-background text"}>Home:</td>
                    <td className={"margin gold-background text"}>Result:</td>
                    <td className={"margin gold-background text"}>Guest:</td>
                    <td className={"margin gold-background text"}>Time:</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className={"gold text"}>{this.state.game.home?.name}</td>
                    <td className={"red text"}>{this.state.game.state}</td>
                    <td className={"silver text"}>{this.state.game.guest?.name}</td>
                    <td className={"green text"}>{90-3*this.state.game.currentTime}</td>
                </tr>
                </tbody>
            </table>
        </div>);
    }
}
export default CurrentGame;