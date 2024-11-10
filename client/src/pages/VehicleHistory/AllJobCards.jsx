import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { getVehicleJobCardDetails } from "../../apicaller";
import { useDataServiceContext } from "../../context/dataProvider";
import _ from "lodash";
import withUserAuth from "../../hoc/withUserAuth";

const AllJobCards = () => {

    const { apiData } = useDataServiceContext();

    const vehicleJobs = apiData.vehicleHistory?.data?.jobs || []
    const isJobCardsLoading = apiData.isJobCardsLoading;

    if (isJobCardsLoading) return <Row className="justify-content-center h4 mt-5 pt-5">Loading.....</Row>

    if (_.isEmpty(vehicleJobs)) return <Row className="justify-content-center h4 mt-5 pt-5">No Data Found</Row>

    return (
        <>
            {
                vehicleJobs.map(({ status, issues = [], remarks = "" }, index) => {
                    return (
                        <Row key={index} className="border rounded my-2 p-2">
                            <Col>
                                <Row>
                                    <Col className="text-success fw-bold">{_.startCase(status)}</Col>
                                </Row>
                                <Row className="text-muted">Issues</Row>
                                <Row className="text-dark">{issues.join(",")}, Other - { remarks }</Row>
                            </Col>
                        </Row>
                    )
                })
            }
        </>
    )

}

export default withUserAuth(AllJobCards);