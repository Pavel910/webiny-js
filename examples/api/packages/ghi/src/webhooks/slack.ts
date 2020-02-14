import got from "got";
import config from "../config";

export const sendToSlack = (text: string) => {
    return got(config.slack.WEBHOOK_URL, {
        method: "post",
        json: { text }
    });
};
