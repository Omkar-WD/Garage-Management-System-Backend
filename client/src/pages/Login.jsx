import React, { useState } from "react"
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Spinner } from "reactstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../apicaller";
import useLocalStorage from "../hook/useLocalStorage";

const Login = () => {

    // const localStorage = useLocalStorage();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const loginHandler = async (ev) => {
        ev.preventDefault();
        if (!username || !password) {
            alert("Please enter username and password")
            return;
        }
        setIsLoading(true);
        try {
            const response = await loginUser({username, password})
            localStorage.setItem("userDetails", JSON.stringify(response.data.user))
            return navigate("/")
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (localStorage.getItem("isLoggedIn")) {
        return <Navigate to="/" />
    }

    const renderButton = () => {
        if (isLoading) {
            return (
                <Button className="w-100" disabled={isLoading} type="submit" color="primary">
                    <Spinner
                        size="sm"
                        color="light"
                    />
                    <span className="ms-2">Logging In</span>
                </Button>
            )
        }
        return (
            <Button className="w-100" type="submit" color="primary">
                Login
            </Button>
        )
    }
    return (
        <Row className="mt-5">
            <Col>
                <Card>
                    <CardBody>
                        <Form onSubmit={loginHandler}>
                            <FormGroup className="pb-2 mr-sm-2 mb-sm-0">
                                <Label for="exampleEmail" className="mr-sm-2">
                                    User Name
                                </Label>
                                <Input
                                    type="text"
                                    name="username"
                                    value={username}
                                    disabled={isLoading}
                                    placeholder="User Name"
                                    onChange={(ev) => setUsername(ev.currentTarget.value)}
                                />
                            </FormGroup>
                            <FormGroup className="pb-2 mr-sm-2 mb-sm-0">
                                <Label for="examplePassword" className="mr-sm-2">
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    name="password"
                                    disabled={isLoading}
                                    placeholder="don't tell!"
                                    value={password}
                                    onChange={(ev) => setPassword(ev.currentTarget.value)}
                                />
                            </FormGroup>
                            {renderButton()}
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

const withUser = (ChildrenComponent) => (props) => {
    let userDetails = localStorage.getItem("userDetails");
    userDetails = userDetails ? JSON.parse(userDetails) : null;
    console.log("userDetails", userDetails);
    try {
        if (userDetails?.token) {
            return <Navigate to={"/"} />;
        } else {
            return <ChildrenComponent {...props} />;
        }
    } catch (error) {
        console.log(error)
    }
}


export default withUser(Login);