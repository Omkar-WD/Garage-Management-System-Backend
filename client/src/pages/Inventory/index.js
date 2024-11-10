import React from 'react'
import { Col, Row } from 'reactstrap'
import useToggle from '../../hook/useToggle'
import CustomButton from '../../components/Button'
import * as Icon from 'react-bootstrap-icons';
import AddInventory from './Modal/AddInventory'

const Inventory = () => {

    const [isAddInventoryModalOpen, toggleAddInventoryModal] = useToggle()


    return (
        <>
            <AddInventory isAddInventoryModalOpen={isAddInventoryModalOpen} toggleAddInventoryModal={toggleAddInventoryModal} />
            <Row className='mx-0'>
                <Col className='px-0 h5 d-flex align-items-center'>Inventory Details</Col>
                <Col className="px-0 d-flex justify-content-end mt-3">
                    <CustomButton color="success" onClick={toggleAddInventoryModal} className="d-flex align-items-center px-3" > <Icon.PersonAdd className='me-2' size="15" /> Add</CustomButton>
                </Col>
            </Row>
        </>
    )
}

export default Inventory