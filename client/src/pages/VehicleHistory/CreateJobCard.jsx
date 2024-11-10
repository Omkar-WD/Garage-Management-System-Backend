import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Form, FormGroup, Input, Row } from "reactstrap";
import { createJobCard, getVehicleJobCardDetails } from "../../apicaller";
import { useDataServiceContext } from "../../context/dataProvider";
import reactValidator from "../../components/Validator";
import _ from "lodash";
import CustomButton from "../../components/Button";
import withUserAuth from "../../hoc/withUserAuth";
import ReactValidator from "../../components/Validator";

const issues = [
    {
        name: "one",
        label: "Clutch And Brake Work"
    },
    {
        name: "two",
        label: "Electrical Work"
    },
    {
        name: "three",
        label: "Engine Work"
    },
    {
        name: "four",
        label: "General Service"
    }
]

const CreateJobCard = () => {

    const { vehicleMongoId } = useParams();
    const { handleSetApiData, errorHandlingForApis } = useDataServiceContext();

    const [validator, setValidator] = useState(new reactValidator())
    const [rerender, setRerender] = useState(false);
    const [isCreatingJobCard, setIsCreatingJobCard] = useState(false);
    const navigate = useNavigate();
    const [jobCardDetails, setJobCardDetails] = useState({
        "issues": [],
        "advancePay": "",
        "odometer": "",
        "estimatedDelivery": "",
        "vehicleReceivedFrom": "",
        "vehicleCollectedBy": "",
        "remarks": "",
    })

    const handleJobCardCreateChange = (e) => {
        const { value, checked } = e.target;
        const dummyIssues = [...jobCardDetails.issues];
        if (checked) {
            dummyIssues.push(value);
            setJobCardDetails({
                ...jobCardDetails,
                issues: dummyIssues
            })
        } else {
            const index = dummyIssues.indexOf(value);
            if (index > -1) { // only splice array when item is found
                dummyIssues.splice(index, 1); // 2nd parameter means remove one item only
            }
            setJobCardDetails({
                ...jobCardDetails,
                issues: dummyIssues
            })
        }
    }

    const handleJobCardAdd = async () => {
        if (!validator.allValid()) {
            validator.showMessages();
            setRerender(!rerender)
            return false;
        }
        setIsCreatingJobCard(true);
        try {
            await createJobCard({ ...jobCardDetails, vehicleNumber: vehicleMongoId });
            const { data } = await getVehicleJobCardDetails(vehicleMongoId);
            handleSetApiData({ "vehicleHistory": data });
            setValidator(new ReactValidator());
            navigate(`/${vehicleMongoId}/all-job-cards`);
        } catch (error) {
            errorHandlingForApis(error);
        } finally {
            setIsCreatingJobCard(false);
        }
    }

    const renderValidator = (blurLabel, value, regex) => {
        let validationMessage = validator.message(blurLabel, value, regex, "", {}, true);
        return (
            <Col className="text-danger text-start">
                {validationMessage}
            </Col>
        );
    };

    return <Row>
        <Col>
            <Row>
                <Form>
                    {
                        issues.map(({ label, name }, index) => {
                            return (
                                <Col key={index} className="d-flex justify-content-between my-2">
                                    <span>
                                        {label}
                                    </span>
                                    <span>
                                        <Input disabled={isCreatingJobCard} type="checkbox" name={name} value={label} onClick={handleJobCardCreateChange} />
                                    </span>
                                </Col>
                            )
                        })
                    }
                </Form>
                {renderValidator("Atleast one issue", jobCardDetails.issues.length ? "present": "", "required")}
            </Row>
            <Row className="my-2">
                <Input type="tel" disabled={isCreatingJobCard} placeholder="Odometer" value={jobCardDetails.odometer} onChange={(e) => setJobCardDetails({ ...jobCardDetails, odometer: e.target.value })} />
                {renderValidator("Odometer reading", jobCardDetails.odometer, "required")}
            </Row>
            <Row className="my-2">
                <Input type="tel" disabled={isCreatingJobCard} placeholder="Advance Pay" value={jobCardDetails.advancePay} onChange={(e) => setJobCardDetails({ ...jobCardDetails, advancePay: e.target.value })} />
                {renderValidator("Advance pay", jobCardDetails.advancePay, "required")}
            </Row>
            <Row>Estimated Delivery</Row>
            <Row>
                <Input type="date" disabled={isCreatingJobCard} value={jobCardDetails.estimatedDelivery} onChange={(e) => setJobCardDetails({ ...jobCardDetails, estimatedDelivery: e.target.value })} />
                {renderValidator("Delivery Data", jobCardDetails.estimatedDelivery, "required")}
            </Row>
            <Row className="my-2">
                <Col xs="auto" className="px-0">Vehicle Condition</Col>
                <FormGroup className="px-0">
                    <Input
                        onChange={(e) => setJobCardDetails({ ...jobCardDetails, remarks: e.target.value })}
                        name="remarks"
                        type="textarea"
                        placeholder="Remarks on any damages"
                        disabled={isCreatingJobCard}
                    />
                </FormGroup>
            </Row>
            <Row>
                <CustomButton isLoading={isCreatingJobCard} color="primary" block className="my-3" onClick={handleJobCardAdd}>Add</CustomButton>
            </Row>
        </Col >
    </Row >
}

export default withUserAuth(CreateJobCard);