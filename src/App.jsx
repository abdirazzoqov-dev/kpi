import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TableComponent from "./components/TableComponent";
import Navbar from "./components/Navbar";


function App() {
    return (
        <Router>
            <Navbar />
            <div className="p-5">
                <Routes>
                    <Route path="/" element={<TableComponent />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
