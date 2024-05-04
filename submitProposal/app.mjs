export const submitProposalHandler = async (event, context) => {
  console.log("🚀  event.body:", event.body);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: event.body,
    }),
  };

  return response;
};
