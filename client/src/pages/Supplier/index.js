import React from 'react'
import AddSuplier from './Modal/AddSuplier'
import { Col, Row } from 'reactstrap'
import useToggle from '../../hook/useToggle'
import CustomButton from '../../components/Button'
import * as Icon from 'react-bootstrap-icons';

const Supplier = () => {

    const [isAddSupplierModalOpen, toggleAddSupplierModal] = useToggle()


    return (
        <>
            <AddSuplier isAddSupplierModalOpen={isAddSupplierModalOpen} toggleAddSupplierModal={toggleAddSupplierModal} />
            <Row className='mx-0'>
                <Col className="px-0 d-flex justify-content-end mt-3">
                    
                    <CustomButton color="success" onClick={toggleAddSupplierModal} className="d-flex align-items-center px-3" > <Icon.PersonAdd className='me-2' size="15" /> Add</CustomButton>
                </Col>
            </Row>
            <Row>
                {
                    [1, 2].map(() => {
                        return (
                            <Row className='border rounded-4 my-2'>
                                <Col xs="2" className='m-1 p-2 py-3 bg-danger-subtle border rounded-circle d-flex align-items-center justify-content-center'>Icon</Col>
                                <Col className='px-0 d-flex align-items-center'>
                                    <Row className='mx-0 ps-2 align-items-center'>
                                        <Col xs="12" className='px-0'>Name: { "Sagar" }</Col>
                                        <Col className='px-0'>Mobile: { "Mobile" }</Col>
                                    </Row>
                                </Col>
                                <Col xs="auto" className='bg-success-subtle d-flex align-items-center    rounded-end-4 mousePointer'>
                                    <a href={`tel:+917741049598`} >
                                        <Icon.Telephone size="20" />
                                    </a>
                                </Col>
                            </Row>
                        )
                    })
                }
            </Row>
        </>
    )
}

export default Supplier