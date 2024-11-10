import React, { useState } from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import CustomButton from '../../../components/Button';
import useToggle from '../../../hook/useToggle';
import withUserAuth from '../../../hoc/withUserAuth';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';
import _ from 'lodash';

const inputSpecifications = {
    partNumber: {
        label: ""
    },
    singleItemBuyPrice: {
        label: ""
    },
    quantity: {
        label: "Quantity"
    }
}

const initialInventoryDetails = {
    name: "",
    partNumber: "",
    singleItemBuyPrice: "",
    quantity: ""
}

const AddInventory = (props) => {

    const [supplierDetails, setSupplierDetails] = useState({
        name: ""
    })

    const [inventoryDetails, setInventoryDetails] = useState([initialInventoryDetails]);
    const [isCreatingInventory, toggleInCreatingInventory] = useToggle();
    const [openedInventoryItem, setOpenInventoryItem] = useState({ 0: true });

    const handleCreateSupplier = () => {
        toggleInCreatingInventory();
        setTimeout(() => {
            toggleInCreatingInventory();
            handleModalClose();
        }, 2000);
    };

    const handleModalClose = () => {
        if (isCreatingInventory) return;
        setInventoryDetails([initialInventoryDetails]);
        setOpenInventoryItem({ 0: true });
        props.toggleAddInventoryModal()
    };

    const handleOpenInventoryState = (id) => {
        setOpenInventoryItem({
            ...openedInventoryItem,
            [id]: !openedInventoryItem[id]
        })
    };

    const handleRemoveCurrentInventory = (id) => {
        setInventoryDetails((prevItems) => prevItems.filter((_, index) => index != id))
    };

    const handleAddInventory = () => {
        setInventoryDetails([...inventoryDetails, initialInventoryDetails]);
        const newKey = Object.keys(openedInventoryItem).length;
        setOpenInventoryItem({
            ...openedInventoryItem,
            [newKey]: true
        })
    };

    const handleInventoryChange = (e, index) => {
        setInventoryDetails((prevItems) => {
            return prevItems.map((item, itemIndex) => {
                if (itemIndex == index) {
                    return {
                        ...item,
                        [e.target.name]: e.target.value
                    }
                }
                return item;
            })
        })
    }

    const openInventoryItems = Object.entries(openedInventoryItem).filter((entry) => entry[1]).map((entry) => entry[0]);


    return (
        <Modal isOpen={props.isAddInventoryModalOpen} toggle={handleModalClose} centered>
            <ModalHeader toggle={handleModalClose}>
                Add Inventory
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Input type="text" disabled={true} placeholder="Supplier Name" value={supplierDetails.name} onChange={(e) => setSupplierDetails({ ...supplierDetails, [e.target.name]: e.target.value })} />
                </FormGroup>
                <Row className='mx-0'>
                    <Accordion className='px-0' open={openInventoryItems} toggle={handleOpenInventoryState}>
                        {
                            inventoryDetails.map((inventory, index) => {
                                return (
                                    <AccordionItem key={index}>
                                        <AccordionHeader targetId={String(index)}>Part {index + 1} {inventory.name && `- ${inventory.name}`}</AccordionHeader>
                                        <AccordionBody accordionId={String(index)}>
                                            <FormGroup>
                                                <Input
                                                    type={"text"}
                                                    disabled={isCreatingInventory}
                                                    name="name"
                                                    placeholder={"Part Name"}
                                                    value={inventory.name} onChange={(e) => handleInventoryChange(e, index)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Input
                                                    type={"text"}
                                                    disabled={isCreatingInventory}
                                                    name="partNumber"
                                                    placeholder={"Part Number"}
                                                    value={inventory.partNumber} onChange={(e) => handleInventoryChange(e, index)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Input
                                                    type="tel"
                                                    disabled={isCreatingInventory}
                                                    name="singleItemBuyPrice"
                                                    placeholder={"Single Item Price"}
                                                    value={inventory.singleItemBuyPrice} onChange={(e) => handleInventoryChange(e, index)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Input
                                                    type="tel"
                                                    disabled={isCreatingInventory}
                                                    name="quantity"
                                                    placeholder={"Quantity"}
                                                    value={inventory.quantity} onChange={(e) => handleInventoryChange(e, index)}
                                                />
                                            </FormGroup>
                                            <Row className='justify-content-end'>
                                                <Col className='d-flex justify-content-end'>
                                                    <CustomButton color="danger" onClick={() => handleRemoveCurrentInventory(index)}>Remove</CustomButton>
                                                </Col>
                                            </Row>
                                        </AccordionBody>
                                    </AccordionItem>
                                )
                            })
                        }
                    </Accordion>
                    <Row className='mx-0 py-2 justify-content-end' onClick={handleAddInventory}>
                        <Col xs="auto" className='px-0'>
                            <PlusCircle size="20" />
                        </Col>
                        <Col xs="auto" className='pe-0'>
                            Add Part
                        </Col>
                    </Row>
                </Row>
                <Row className="justify-content-center mt-3">
                    <CustomButton isLoading={isCreatingInventory} disabled={isCreatingInventory} color="primary" onClick={handleCreateSupplier} >Save</CustomButton>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default withUserAuth(AddInventory)