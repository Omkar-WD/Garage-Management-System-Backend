import React, { useState } from 'react'
import { Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import CustomButton from '../../../components/Button';
import useToggle from '../../../hook/useToggle';
import withUserAuth from '../../../hoc/withUserAuth';

const inputSpecifications = [
    {
        label: "Supplier Name",
        name: "name"
    },
    {
        label: "Mobile Number",
        name: "mobile"
    },
    {
        label: "GST",
        name: "gst"
    },
    {
        label: "Email",
        name: "email"
    }
]

const AddSuplier = (props) => {

    const [supplierDetails, setSupplierDetails] = useState({
        name: "",
        mobile: "",
        gst: "",
        email: ""
    });
    const [isCreatingSuppler, toggleIsCreatingSupplier] = useToggle();

    const handleCreateSupplier = () => {
        toggleIsCreatingSupplier();
        setTimeout(() => {
            toggleIsCreatingSupplier();
        }, 2000);
    };

    const handleModalClose = () => {
        if(isCreatingSuppler) return;
        props.toggleAddSupplierModal()
    }


    return (
        <Modal isOpen={props.isAddSupplierModalOpen} toggle={handleModalClose} centered>
            <ModalHeader toggle={handleModalClose}>
                Add Supplier
            </ModalHeader>
            <ModalBody>
                {
                    inputSpecifications.map(({ type, label, name }, index) => {
                        return (
                            <FormGroup>
                                <Input key={index} type={type} disabled={isCreatingSuppler} placeholder={label} value={supplierDetails[name]} onChange={(e) => setSupplierDetails({ ...supplierDetails, [name]: e.target.value })} />
                            </FormGroup>
                        )
                    })
                }
                <Row className="justify-content-center">
                    <CustomButton isLoading={isCreatingSuppler} disabled={isCreatingSuppler} color="primary" onClick={handleCreateSupplier} >Add</CustomButton>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default withUserAuth(AddSuplier)