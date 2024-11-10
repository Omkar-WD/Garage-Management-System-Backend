import { Modal, ModalBody, Row } from "reactstrap"
import { useDataServiceContext } from "../context/dataProvider";
import CustomButton from "./Button";
import useLocalStorage from "../hook/useLocalStorage";
import { useNavigate } from "react-router-dom";

const LogoutModal = () => {
    const { errorDetails, setErrorDetails } = useDataServiceContext();
    const { clear } =  useLocalStorage();
    const navigate = useNavigate();

    if (errorDetails.status == 400) {
        return (
            <Modal isOpen={true} centered>
                <ModalBody>
                    <Row className="text-center my-4 h5">
                        Something went wrong please try again later
                    </Row>
                    <Row>
                        <CustomButton color="primary" onClick={() => {
                            clear();
                            setErrorDetails({});
                        }}>OK</CustomButton>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }

    if (errorDetails.status == 403) {
        return (
            <Modal isOpen={true} centered>
                <ModalBody>
                    <Row className="text-center my-4 h5">
                        You have been logged out, please login to continue!
                    </Row>
                    <Row>
                        <CustomButton color="primary" onClick={() => {
                            clear();
                            setErrorDetails({});
                            navigate("/login");
                        }}>OK</CustomButton>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }

}

export default LogoutModal;