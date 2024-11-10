import React from "react";
import { Col, Row } from "reactstrap";
import { useDataServiceContext } from "../../context/dataProvider";
import withUserAuth from "../../hoc/withUserAuth";

const VehicleSummary = () => {
    const { apiData } = useDataServiceContext();

    const vehicleDetails = apiData.vehicleHistory?.data || {};
    const isJobCardsLoading = apiData.isJobCardsLoading;

    if (isJobCardsLoading) return <Row className="justify-content-center h4 mt-5 pt-5">Loading.....</Row>

    return (
        <>
            <Col xs="12">
                <Row>Model Name</Row>
                <Row className="h6">{vehicleDetails.brand?.name} - { vehicleDetails.model?.name }</Row>
            </Col>
            <hr className="my-2"/>
            <Col xs="12">
                <Row>Fule Type</Row>
                <Row className="h6">-</Row>
            </Col>
            <hr className="my-2"/>
            <Col xs="12">
                <Row>Customer Name</Row>
                <Row className="h6">{vehicleDetails.customerName }</Row>
            </Col>
            <hr className="my-2"/>
            <Col xs="12">
                <Row>Customer Number</Row>
                <Row className="h6">{vehicleDetails.customerMobile }</Row>
            </Col>
            <hr className="my-2"/>
            <Col xs="12">
                <Row>Address</Row>
                <Row className="h6">{vehicleDetails.customerAddress }</Row>
            </Col>
        </>
    )
}

export default withUserAuth(VehicleSummary);