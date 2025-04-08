import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Home from "./pages/Home";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerPanel from "./pages/OwnerPanel";
import SupplierLogin from "./pages/SupplierLogin";
import CreateOrder from "./pages/CreateOrder";
import OrdersStatus from "./pages/OrdersStatus";
import AllOrders from "./pages/AllOrders"
import ConfirmOrders from "./pages/ConfirmOrders"

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/owner-login" element={<OwnerLogin />} />
      <Route path="/owner-panel" element={<OwnerPanel />} />
      <Route path="/create-order" element={<CreateOrder />} />
      <Route path="/orders-status" element={<OrdersStatus/>}/>
      <Route path="/confirm-orders" element={<ConfirmOrders/>} />
      <Route path="/all-orders" element={<AllOrders/>} />
      <Route path="/supplier-login" element={<SupplierLogin />} />

      </Routes>
    </Router>
  );
}

export default App;
