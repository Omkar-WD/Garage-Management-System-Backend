import _ from "lodash";
import { Link, Outlet } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import useLocalStorage from "../hook/useLocalStorage";
import withUserAuth from "../hoc/withUserAuth";

const Dashboard = () => {

    const localStorage = useLocalStorage()

    const userDetails = localStorage.getItem("userDetails") || {};

    return (
        <Row >
            <Col className="my-4 h4">Welcome {_.upperFirst(_.toLower(userDetails.firstName))} {_.upperFirst(_.toLower(userDetails.lastName))}</Col>
            <Col xs="12" className="px-0">
                <Row>
                    <Col className="px-1">
                        <Link to="/add-vehicle" className="px-0"><Button color="primary my-2 w-100">Add Vehicle</Button></Link>
                    </Col>
                    <Col className="px-1">
                        <Link to="/" className="px-0"><Button color="primary my-2 w-100">All Vehicle</Button></Link>
                    </Col>
                </Row>
                <Outlet />
            </Col>
        </Row>
    )
}

export default withUserAuth(Dashboard);