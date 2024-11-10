import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { getAllVehicles } from "../apicaller";
import { useDataServiceContext } from "../context/dataProvider";
import withUserAuth from "../hoc/withUserAuth";

const AllVehicles = () => {

    const { handleSetApiData, apiData, errorHandlingForApis } = useDataServiceContext();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getVehicles = async() => {
            try {
                const { data } = await getAllVehicles();
                handleSetApiData({ "allVehicleDetails": data })
            } catch (error) {
                errorHandlingForApis(error)
            } finally {
                setIsLoading(false);
            }
        }
        getVehicles();
    }, [])

    if (isLoading) return <Row className="justify-content-center h4 mt-5 pt-5">Loading.....</Row>

    if (!apiData.allVehicleDetails?.data?.length) return <Row className="justify-content-center h4 mt-5 pt-5">No Data Found</Row>

    return (
        <Row>
            {
                apiData.allVehicleDetails?.data?.map(({ _id, number, customerName, jobs }, index) => {
                    const isJobCardsPresent = jobs.length;
                    return (
                        <Col xs="4" className="px-1 mt-2" key={index} style={{ height: "100px" }}>
                            <Link to={ isJobCardsPresent ? `/${_id}/all-job-cards` : `/${_id}/create-job-card` } className="text-black text-decoration-none">
                                <Row className="border rounded bg-white h-100 px-2">
                                    <Col className="d-flex align-items-center flex-column justify-content-center">
                                        <Row className="h6">{number}</Row>
                                        <Row className="text-center">{customerName}</Row>
                                    </Col>
                                </Row>
                            </Link>
                        </Col>
                    )
                })
            }
        </Row>
    )
}

export default withUserAuth(AllVehicles);