import React, { useEffect, useState } from 'react';
import { Container, Form, FormGroup, Input, Button, Row, Modal, ModalBody, ModalFooter, Col } from 'reactstrap';
import VehicleNumber from '../components/VehicleNumber';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { addVehicle } from '../apicaller';
import CustomButton from '../components/Button';
import { useDataServiceContext } from '../context/dataProvider';
import ReactValidator from '../components/Validator';
import VehicleBrandAndModel from '../components/VehicleBrandAndModel';

const jobCardData = [
    { name: "customerName", placeholder: "Customer Name" },
    { type: "tel", name: "customerMobile", placeholder: "Customer Number" },
    { name: "customerAddress", placeholder: "Customer Address" }
]

const CreateOrder = () => {

    const { errorHandlingForApis } = useDataServiceContext();
    const [validator, setValidator] = useState(new ReactValidator())

    const [jobCardDetails, setJobCardDetails] = useState({
        number: "",
        numberDetails: {
            stateCode: "",
            districtCode: "",
            alphaNumber: "",
            numericNumber: ""
        },
        customerName: "",
        type:"67148b7312aed04f68c9af13",
        brand: "",
        brandMongoId: "",
        model: "",
        modelMongoId: "",
        customerMobile: "",
        customerAddress: ""
    });

    const [isVehicleAdded, setIsVehicleAdded] = useState(false);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [rerender, setRerender] = useState(false);


    const navigate = useNavigate();

    const renderValidator = (blurLabel, value, regex) => {
        let validationMessage = validator.message(blurLabel, value, regex, "", {}, true);
        return (
            <Col className="text-danger text-start">
                {validationMessage}
            </Col>
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobCardDetails(prevOrder => ({
            ...prevOrder,
            [name]: value
        }));
    };

    const handleSetVehicleNumberDetails = (e) => {
        const { name, value } = e.target;
        const wholeVehicleNumberDetails = {...jobCardDetails.numberDetails};
        wholeVehicleNumberDetails[name] = _.toUpper(value)
        setJobCardDetails({
            ...jobCardDetails,
            numberDetails: {
                ...jobCardDetails.numberDetails,
                [name]: _.toUpper(value)
            },
            number: Object.values(wholeVehicleNumberDetails).join("")
        })
    }

    const handleSubmit = async() => {
        if (!validator.allValid()) {
            validator.showMessages();
            setRerender(!rerender)
            return false;
        }
        setIsAddingVehicle(true);
        const postData = {...jobCardDetails};
        postData.model = postData.modelMongoId;
        postData.brand = postData.brandMongoId;
        delete postData.modelMongoId;
        delete postData.brandMongoId;
        try {
            await addVehicle(postData);
            setIsVehicleAdded(true);
        } catch (error) {
            errorHandlingForApis(error)
        } finally {
            setIsAddingVehicle(false)
            setValidator(new ReactValidator())
        }
    };

    return (
        <Container className="px-0 pb-5">
            <Row className="h1 my-4 justify-content-center">Add Vehicle</Row>
            <Form>
                <VehicleNumber jobCardDetails = {jobCardDetails} handleSetVehicleNumberDetails={handleSetVehicleNumberDetails} validator={validator} renderValidator={renderValidator} />
                <VehicleBrandAndModel jobCardDetails={jobCardDetails} setJobCardDetails={setJobCardDetails} renderValidator={renderValidator}/>
                {
                    jobCardData.map(({ type, name, placeholder, options, disabledKey }, index) => {
                        return (
                            <FormGroup key={index}>
                                {type === "select" ? (
                                    <Input
                                        type="select"
                                        id={name}
                                        name={name}
                                        value={jobCardDetails[name]}
                                        onChange={handleInputChange}
                                        required
                                        disabled={(disabledKey && !jobCardDetails[disabledKey]) || isAddingVehicle}
                                    >
                                        {options.map(({ value, label }, optionIndex) => (
                                            <option value={value} key={optionIndex}>{label}</option>
                                        ))}
                                    </Input>
                                ) : (
                                    <>
                                        <Input
                                            type={type || "text"}
                                            id={name}
                                            name={name}
                                            disabled={isAddingVehicle}
                                            value={jobCardDetails[name]}
                                            placeholder={placeholder}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {renderValidator(placeholder, jobCardDetails[name], "required")}
                                    </>
                                )}
                            </FormGroup>
                        );
                    })
                }
                <CustomButton className="w-100" color="success" disabled={isAddingVehicle} isLoading={isAddingVehicle} onClick={handleSubmit}>Save & Create Job Card</CustomButton>
            </Form>
            <Modal isOpen={isVehicleAdded} centered>
                <ModalBody className="d-flex justify-content-center">
                    <h2>Vehicle Added</h2>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                    <Button color='primary' onClick={() => {
                        setIsVehicleAdded(false);
                        navigate("/")
                    }}>OK</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default CreateOrder;
