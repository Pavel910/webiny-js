import { StarEvent } from "../events";
import createModels from "../models";
import { sendToSlack } from "./slack";
import { StarType } from "../types/star";

export default async (ghEvent: string, payload: any) => {
    const { ActivityLogModel } = createModels();

    switch (ghEvent) {
        case "star":
        case "unstar":
            const starEvent = new StarEvent(payload as StarType);

            const activityLog = new ActivityLogModel();
            activityLog.populate({
                repository: starEvent.data.repository.name,
                event: ghEvent,
                owner: starEvent.data.sender.login,
                message: starEvent.data.sender.login + " " + ghEvent + " your repo",
                link: starEvent.data.repository.homepage
            });
            await activityLog.save();

            sendToSlack(starEvent.data.sender.login + " " + ghEvent + " your repo");

            break;
    }
};
