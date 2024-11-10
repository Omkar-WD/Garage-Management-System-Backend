import { Button, Spinner } from "reactstrap"

const CustomButton = ({ isLoading, children, ...restProps }) => {
    if (isLoading) {
        return (
            <Button {...restProps}>
                <Spinner
                    size="sm"
                    color="light"
                />
                <span className="ms-2">{children}</span>
            </Button>
        )
    }
    return (
        <Button {...restProps}>
            {children}
        </Button>
    )
}

export default CustomButton