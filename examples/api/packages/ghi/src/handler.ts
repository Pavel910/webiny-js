import githubHandler from "./webhooks/github";

export const handler = async event => {
    const body = JSON.parse(event.body);

    const response = await githubHandler(event.headers["X-GitHub-Event"], body);

    return {
        statusCode: 200,
        body: JSON.stringify({ msg: response })
    };
};
