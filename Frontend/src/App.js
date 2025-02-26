import React from "react";
import { Provider } from "react-redux";
import store from "./constants/store";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Header from "./components/Header";
import Body from "./components/Body";
import RestaurantDetail from "./components/RestaurantDetail";
import Error from "./components/Error";

const App = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Provider store={store}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/restaurants/:resId" element={<RestaurantDetail />} />
            <Route path="*" element={<Error />} /> {/* Catch-all for 404 */}
          </Routes>
        </Router>
      </Provider>
    </div>
  );
};

export default App;
