import React, { useState } from "react";
import { Button, Col, Form, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import _ from "lodash";

const VehicleNumber = ({ jobCardDetails, handleSetVehicleNumberDetails, renderValidator }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const numberDetails = jobCardDetails.numberDetails;

    return (
        <>
            <Form onClick={() => setIsModalOpen(!isModalOpen)}>
                <FormGroup>
                    <Input
                        type={"text"}
                        id={"vehicleNumber"}
                        name={"vehicleNumber"}
                        value={`${jobCardDetails.numberDetails.stateCode || ""}${jobCardDetails.numberDetails.districtCode || ""}${jobCardDetails.numberDetails.alphaNumber || ""}${jobCardDetails.numberDetails.numericNumber || ""}`}
                        placeholder={"Vehicle Number"}
                        required
                    />
                    {renderValidator("Vehicle Number", jobCardDetails.number, "required")}
                </FormGroup>
            </Form>
            <Modal isOpen={isModalOpen} centered toggle={() => setIsModalOpen(!isModalOpen)}>
                <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Enter Vehicle Number</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row className="row-cols-lg-auto g-3 align-items-center">
                            <Col className="px-1">
                                <Input
                                    name="stateCode"
                                    placeholder="MH"
                                    value={_.toUpper(numberDetails.stateCode)}
                                    maxLength={2}
                                    type="text"
                                    onChange={handleSetVehicleNumberDetails}
                                />
                            </Col>
                            <Col className="px-1">
                                <Input
                                    name="districtCode"
                                    value={_.toUpper(numberDetails.districtCode)}
                                    placeholder="01"
                                    type="tel"
                                    maxLength={2}
                                    onChange={handleSetVehicleNumberDetails}

                                />
                            </Col>
                            <Col className="px-1">
                                <Input
                                    name="alphaNumber"
                                    value={_.toUpper(numberDetails.alphaNumber)}
                                    placeholder="AB"
                                    maxLength={2}
                                    type="text"
                                    onChange={handleSetVehicleNumberDetails}
                                />
                            </Col>
                            <Col className="px-1">
                                <Input
                                    name="numericNumber"
                                    value={_.toUpper(numberDetails.numericNumber)}
                                    placeholder="1234"
                                    maxLength={4}
                                    type="tel"
                                    onChange={handleSetVehicleNumberDetails}

                                />
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                    <Button color="primary" outline onClick={() => setIsModalOpen(!isModalOpen)}>
                        Done
                    </Button>{' '}

                </ModalFooter>
            </Modal>
        </>
    )
}

export default VehicleNumber;