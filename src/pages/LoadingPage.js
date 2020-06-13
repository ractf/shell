import React from "react";

import { Page, Row, Spinner } from "@ractf/ui-kit";

const LoadingPage = () => (
    <Page centre>
        <Row>
            <Spinner />
        </Row>
    </Page>
);
export default LoadingPage;
