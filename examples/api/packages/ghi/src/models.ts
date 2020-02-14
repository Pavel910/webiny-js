import flow from "lodash.flow";
import { withStorage } from "@webiny/commodo";
import { DbProxyDriver, withId } from "@webiny/commodo-fields-storage-db-proxy";
import createActivityLogModel from "./models/activity";

const dbProxyFunctionName = process.env.DB_PROXY_ARN;

const createBase = ({ maxPerPage = 100 } = {}) =>
    flow(
        withId(),
        withStorage({ driver: new DbProxyDriver({ dbProxyFunctionName }), maxPerPage })
    )();

export default () => {
    return { ActivityLogModel: createActivityLogModel(createBase) };
};
