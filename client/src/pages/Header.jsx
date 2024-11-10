import React, { useState } from "react";
import { Col, Offcanvas, Button, OffcanvasBody, OffcanvasHeader, Row } from "reactstrap";
import * as Icon from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";

const sideMenuDetails = [
    { title: "Home", iconName: "HouseDoorFill", redirectRoute: "/" },
    {title: "Inventory", iconName: "BackpackFill", redirectRoute: "inventory"},
    {title: "Supplier", iconName: "CarFront", redirectRoute: "supplier"}
]

const Header = () => {

    const navigate = useNavigate();

    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const isLoggedIn = localStorage.getItem("userDetails");

    const handleOpenSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

    const handleSideMenuClick = (route) => {
        if (route) {
            navigate(route);
            handleOpenSideMenu();
        }
    }

    return (
        <Row className="d-flex justify-content=between border py-3 bg-secondary" style={{ "--bs-bg-opacity": "0.4" }}>
            <Col className={`d-flex px-3 align-items-center h5 ${!isLoggedIn ? "justify-content-center mousePointer" : ""}`} onClick={() => navigate("/")}>
                Garage Management
            </Col>
            {
                isLoggedIn && (
                    <Col xs="auto" onClick={handleOpenSideMenu}>
                        <Icon.List className="mousePointer" size="30" />
                    </Col>
                )
            }
            <Offcanvas direction="end" className="w-75" isOpen={isSideMenuOpen} toggle={() => setIsSideMenuOpen(false)}>
                <OffcanvasHeader className="pe-4" toggle={() => setIsSideMenuOpen(false)}>
                    Side Menu Details
                </OffcanvasHeader>
                <OffcanvasBody className="px-3">
                    <Col>
                        {
                            sideMenuDetails.map((sideMenuDetails, index) => {
                                const IconName = Icon[sideMenuDetails.iconName];
                                return (
                                    <Row key={index} className="my-3 py-2 fw-bold mousePointer" onClick={() => handleSideMenuClick(sideMenuDetails.redirectRoute)}>
                                        <Col xs="auto" className="px-0 pe-2">
                                            <IconName size="30" />
                                        </Col>
                                        <Col className="d-flex align-items-center">
                                            {sideMenuDetails.title}
                                        </Col>
                                    </Row>
                                )

                            })
                        }

                        <Row className="my-3 py-2 fw-bold" onClick={() => {
                            localStorage.clear();
                            handleOpenSideMenu();
                            navigate("/login");
                        }} >
                            <Col xs="auto" className="px-0 pe-2">
                                <Icon.BoxArrowRight size="30" />
                            </Col>
                            <Col className="d-flex align-items-center">
                                Logout
                            </Col>
                        </Row>
                    </Col>
                </OffcanvasBody>
            </Offcanvas>
        </Row>
    )
}

export default Header;