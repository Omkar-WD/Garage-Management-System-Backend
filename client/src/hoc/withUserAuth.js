import React from "react";
import { Navigate } from "react-router-dom";

const withUserAuth = (ChildrenComponent) => (props) => {
    let userDetails = localStorage.getItem("userDetails");
    userDetails = userDetails ? JSON.parse(userDetails) : null;
    try {
        if (userDetails?.token) {
            return <ChildrenComponent {...props} />;
        } else {
            localStorage.removeItem("userDetails");
            return <Navigate to={"/login"} />;
        }
    } catch (error) {
        console.log(error)
    }
}

export default withUserAuth