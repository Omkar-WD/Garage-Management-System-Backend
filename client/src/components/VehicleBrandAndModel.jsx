import { useEffect, useState } from "react";
import { Button, Card, CardText, CardTitle, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { getVehicleBrands, getVehicleModels } from "../apicaller";
import { useDataServiceContext } from "../context/dataProvider";
import CustomButton from "./Button";

const VehicleBrandAndModel = ({jobCardDetails, setJobCardDetails, renderValidator}) => {

    const { errorHandlingForApis } = useDataServiceContext();
    
    const [isVehicleBrandAndModelModalOpen, setIsVehicleBrandModelModalOpen] = useState(false);
    
    const [activeTab, setActiveTab] = useState(1);
    
    const [vehicleBrands, setVehicleBrands] = useState([]);
    const [selectedVehicleBrand, setSelectedVehicleBrand] = useState("");
    
    const [vehicleModels, setVehicleModels] = useState([]);
    const [selectedVehicleModel, setSelectedVehicleModel] = useState("");
    
    useEffect(() => {
        (async() => {
            try {
                const { data } = await getVehicleBrands();
                const { data: vehicleModelsData } = await getVehicleModels();
                setVehicleBrands(data.data);
                setVehicleModels(vehicleModelsData.data);
            } catch (error) {
                errorHandlingForApis(error);
            } finally {}
        })()
    }, []);

    useEffect(() => {
        setSelectedVehicleModel("");
    }, [selectedVehicleBrand]);

    const handleOnSave = () => {
        setJobCardDetails({
            ...jobCardDetails,
            brand: selectedVehicleBrand,
            brandMongoId: vehicleBrands.find((brand) => brand.name == selectedVehicleBrand)?._id,
            model: selectedVehicleModel,
            modelMongoId: vehicleModels.find((model) => model.name == selectedVehicleModel)?._id
        });
        setIsVehicleBrandModelModalOpen(false);
    }

    return (
        <>
            <Row className="mb-3">
                <Input
                    type={"text"}
                    name={"vehicleBrand"}
                    value={ jobCardDetails.brand ? `${jobCardDetails.brand} - ${jobCardDetails.model}`: ""}
                    placeholder={"Brand Name"}
                    onClick={() => setIsVehicleBrandModelModalOpen(true)}
                    required
                />
                {renderValidator("Brand and Model", jobCardDetails.model, "required")}

            </Row>
            <Modal isOpen={isVehicleBrandAndModelModalOpen} toggle={() => setIsVehicleBrandModelModalOpen(!isVehicleBrandAndModelModalOpen)} centered >
               
                <ModalBody className="pb-0">
                    <div>
                        <Nav tabs>
                            <NavItem>
                                <Button
                                    color="primary"
                                    outline={activeTab == 2 }
                                    onClick={() => setActiveTab(1)}
                                    className="me-2 btn rounded-bottom-0 border-bottom-0"
                                >
                                    Brands
                                </Button>
                            </NavItem>
                            <NavItem>
                                 <CustomButton
                                     color="primary"
                                     outline={activeTab == 1 }
                                     onClick={() => {
                                        if (selectedVehicleBrand) {
                                            setActiveTab(2)
                                        }
                                     }}
                                     className="me-2 btn rounded-bottom-0 border-bottom-0"
                                >
                                    Models
                                </CustomButton>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab.toString()}>
                            <TabPane tabId="1">
                            <Row className="py-3">
                                {
                                    vehicleBrands?.map((brand, index) => {
                                        const selectedVehicleBrandClass = brand.name == selectedVehicleBrand ? "bg-primary-subtle" : "";
                                        return (
                                            <Col xs="4" role="button" className={`border p-2 rounded-3 text-center cursorPointer ${selectedVehicleBrandClass}`}
                                            onClick={() => {
                                                setSelectedVehicleBrand(brand.name);
                                                setActiveTab(2)
                                            }
                                        } key={index}>{brand.name}</Col>
                                        )
                                    })
                                }
                            </Row>
                            </TabPane>
                            <TabPane tabId="2">
                            <Row className="py-3">
                                {
                                    vehicleModels.filter((model) => model.brand.name == selectedVehicleBrand).map((model, index) => {
                                        const activeModelClass = model.name == selectedVehicleModel ? "bg-primary-subtle" : "";
                                        return (
                                            <Col xs="4" role="button" className={`border p-2 rounded-3 text-center cursorPointer ${activeModelClass}`} onClick={() => setSelectedVehicleModel(model.name)} key={index}>{model.name}</Col>
                                        )
                                    })
                                }
                            </Row>
                            </TabPane>
                        </TabContent>
                        </div>
                        <Row className="justify-content-center my-2">
                            <Col xs="5">
                                <CustomButton className="w-100" onClick={handleOnSave} color="primary">Save</CustomButton>
                            </Col>
                        </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default VehicleBrandAndModel;