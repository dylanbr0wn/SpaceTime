import React, { Component, ErrorInfo, ReactNode } from "react";
import PropTypes from "prop-types";
import{ ErrorBoundary as EB} from "react-error-boundary"

/**
 * @name ErrorBoundary
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Error boundary to wrap components and limit how far errors propagate.
 * See [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html).
 */

const ErrorFallback = ({error, hasError}:any) => {
    return <div className="text-center">
    <h2>Something went wrong</h2>
    <details style={{ whiteSpace: "pre-wrap" }}>
        {hasError && error.toString()}
        <br />
        {error.componentStack}
    </details>
</div>;
}

const ErrorBoundary = ({Child}:any) => {
    return (
        <>
            <EB FallbackComponent={
                 ErrorFallback
            }>
                <Child/>
            </EB>
        </>
    )
}

export default ErrorBoundary;
