import AWS from 'aws-sdk';
const lambda = new AWS.Lambda();

async function getConfigFromS3() {
  // const config = require('./lib/config.json');

  return {
    account1: {
      email: 'email',
      password: 'password',
    },
    account2: {
      email: 'email',
      password: 'password',
    },
  };
}

export const triggerLambasForAccountsHandler = async (event, context) => {
  const config = await getConfigFromS3();

  for (const account in config) {
    await lambda
      .invoke({
        FunctionName: 'findJobsFunction',
        InvocationType: 'Event',
        Payload: JSON.stringify(account),
      })
      .promise();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `${event.body}  ---- hillow`,
    }),
  };

  return response;
};
