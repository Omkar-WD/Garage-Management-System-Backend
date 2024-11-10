import React, { useEffect } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import withUserAuth from "../../hoc/withUserAuth";
import { getVehicleJobCardDetails } from "../../apicaller";
import { useDataServiceContext } from "../../context/dataProvider";

const buttonDetails = [
    {
        label: "Create",
        href: "create-job-card"
    },
    {
        label: "History",
        href: "all-job-cards"
    },
    {
        label: "Summary",
        href: "summary"
    }
]


const VehicleHistory = () => {
    const { vehicleNumber } = useParams();
    const { vehicleMongoId } = useParams();
    console.log("context data in vehicle history index", useDataServiceContext());
    const { handleSetApiData, errorHandlingForApis } = useDataServiceContext();


    useEffect(() => {
        (async () => {
            handleSetApiData({ "isJobCardsLoading": true })
            try {
                const { data } = await getVehicleJobCardDetails(vehicleMongoId);
                handleSetApiData({ "vehicleHistory": data })
            } catch (error) {
                errorHandlingForApis(error)
            } finally {
                handleSetApiData({ "isJobCardsLoading": false })
            }

        })()
    }, [])

    return (
        <Col>
            <Row>
                <Col className="h4 text-center my-2">{vehicleNumber}</Col>
            </Row>
            <Row>
                {
                   buttonDetails.map(({label, href}, index) => {
                    return (
                        <Col className="px-2" key={index}>
                            <NavLink to={href} className={({ isActive }) => `btn btn-primary d-block w-100 ${isActive ? "btn-success": ""}`}>
                                {label}
                            </NavLink>
                        </Col>
                    )
                   }) 
                }
            </Row>
            <Row className="my-3 text-center">
                <Outlet />
            </Row>
        </Col>
    )
};

export default withUserAuth(VehicleHistory);