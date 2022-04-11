import React from "react";
import PropTypes from "prop-types";

/**
 * @name SavingIcon
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description A common saving icon that updates based on error status and if saving is in progress.
 */
const SavingIcon = ({
    saving,
    error = false,
    errorMessage = "An unknown error occured.",
}) => {
    if (error) {
        return (
            <span style={{ margin: "10px 5px 10px 20px" }}>
                <i className="far fa-times-circle text-danger " />
                <span style={{ marginLeft: 5 }} className="text-danger">
                    Error: {errorMessage}
                </span>
            </span>
        );
    } else {
        return (
            <span style={{ margin: "10px 5px 10px 20px" }}>
                {saving ? (
                    <>
                        <Spinner
                            className="text-info "
                            as="span"
                            size="sm"
                            animation="border"
                            role="status"
                        />
                        <span className=" text-info " style={{ marginLeft: 5 }}>
                            Saving...
                        </span>
                    </>
                ) : (
                    <>
                        <i className="far fa-check-circle text-success " />
                        <span
                            style={{ marginLeft: 5, marginRight: 15 }}
                            className="text-success "
                        >
                            Saved
                        </span>
                    </>
                )}
            </span>
        );
    }
};
SavingIcon.propTypes = {
    saving: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
};

export default React.memo(SavingIcon);
