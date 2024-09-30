// Create clients and set shared const values outside of the handler.

import {SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs';

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putSqsHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    const sqsClient = new SQSClient({});
    const queueUrl = process.env.SQSqueueName;

    const body = JSON.parse(event.body);

    const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageAttributes: {
            Name: {
                DataType: "String",
                StringValue: body?.name
            }
        },
        MessageBody: `Hello ${body?.name} from Lambda: ${new Date().getTime()}`
    });

    try {

        const response = await sqsClient.send(command);

        console.log("Success - Message sent", response);
      } catch (err) {
        console.log("Error", err.stack);
      }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
