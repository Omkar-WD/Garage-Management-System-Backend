import { Container } from "reactstrap";
import { Route, Routes } from "react-router-dom";
import Header from "./pages/Header";
import LogoutModal from "./components/LogoutModal"
import Dashboard from "./pages/Dashboard";
import AllVehicles from "./pages/AllVehicles"
import VehicleHistory from "./pages/VehicleHistory";
import Login from "./pages/Login"
import CreateOrder from "./pages/CreateOrder"
import CreateJobCard from "./pages/VehicleHistory/CreateJobCard";
import AllJobCards from "./pages/VehicleHistory/AllJobCards";
import VehicleSummary from "./pages/VehicleHistory/VehicleSummary";
import Inventory from "./pages/Inventory";
import Supplier from "./pages/Supplier";

function App() {

    return (
        <Container className="border-success mx-0 px-0" style={{ height: "100%" }}>
            <LogoutModal/>
            <Header />
            <Container style={{ minHeight: "90vh" }} className="bg-light">
                <Routes>
                    <Route element={<Dashboard />}>
                        <Route path="/" element={<AllVehicles />} />
                    </Route>
                    <Route path="supplier" element={<Supplier />} />
                    <Route path="inventory" element={<Inventory />}>
                        <Route path="add-supplier" element={<div>supplier</div>} />
                        <Route path="history" element={<div>History</div>} />
                    </Route>
                    <Route path="/:vehicleMongoId" element={<VehicleHistory />}>
                        <Route path="create-job-card" element={<CreateJobCard />} />
                        <Route path="all-job-cards" element={<AllJobCards />} />
                        <Route path="summary" element={<VehicleSummary />} />
                    </Route>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/add-vehicle" element={<CreateOrder />} />
                </Routes>
            </Container>
        </Container>
    )
}

export default App;
