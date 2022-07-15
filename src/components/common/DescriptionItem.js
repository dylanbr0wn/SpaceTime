import React from "react";
import PropTypes from "prop-types";

/**
 * @name DescriptionItem
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Simple description
 */
const DescriptionItem = ({ header, info }) => (
	<>
		<div style={{ margin: "10px 0" }}>
			<div className="text-muted" style={{ fontSize: "0.8rem" }}>
				{header}
			</div>
			<div style={{ fontSize: "1.2rem", fontWeight: 500 }}>{info}</div>
		</div>
	</>
);

DescriptionItem.propTypes = {
	header: PropTypes.string.isRequired,
	// String with header text
	info: PropTypes.string,
	// String with info text
};

export default DescriptionItem;
