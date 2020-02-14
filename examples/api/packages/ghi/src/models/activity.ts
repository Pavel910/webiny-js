import flow from "lodash.flow";
import { validation } from "@webiny/validation";
import { withFields, string, withName } from "@webiny/commodo";

const createActivityLogModel = createBase =>
    flow(
        withName("GhiActivityLog"),
        withFields({
            repository: string({ validation: validation.create("required") }),
            event: string({ validation: validation.create("required") }),
            owner: string({ validation: validation.create("required") }),
            message: string({ validation: validation.create("required") }),
            link: string()
        })
    )(createBase());

export default createActivityLogModel;
