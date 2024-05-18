import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
  } from '@aws-sdk/lib-dynamodb';
  
  import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
  
  const client = new DynamoDBClient();
  const docClient = DynamoDBDocumentClient.from(client);
  /*
  async function createItem(tableName, item) {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });
  
    try {
      const data = await docClient.send(command);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  
  async function getItem(tableName, key) {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });
  
    try {
      const data = await docClient.send(command);
      return data.Item;
    } catch (error) {
      console.error(error);
    }
  }
  
  async function updateItem(tableName, key, updateExpression, attributeValues) {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: attributeValues,
    });
  
    try {
      const data = await docClient.send(command);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  

  
  async function deleteItem(tableName, key) {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });
  
    try {
      const data = await docClient.send(command);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  */

  async function getAllItems(tableName) {
    const command = new ScanCommand({
      TableName: tableName,
    });
  
    try {
      const data = await docClient.send(command);
      return data.Items;
    } catch (error) {
      console.error(error);
    }
  }
  export const upworkBotApiHandler = async (event) => {
    let body;
    let statusCode = 200;
  
    const tableName = process.env.UPWORKTABLENAME;
  
  
    switch (event.httpMethod) {
    //   case 'POST':
    //     body = await createItem(tableName, event.body);
    //     break;
      case 'GET':
        if (event.pathParameters && event.pathParameters.id) {
        //   const key = {
        //     id: event.pathParameters.id,
        //   };
        //   body = await getItem(tableName, key);
        } else if (event.path === '/items') {
          body = await getAllItems(tableName);
        } else {
          statusCode = 400;
          body = 'Unsupported GET request';
        }
        break;
    //   case 'PUT':
    //     const keyToUpdate = {
    //       id: event.pathParameters.id,
    //     };
    //     body = await updateItem(tableName, keyToUpdate, 'SET attribute = :value', { ':value': 'new_value' }); // You'll need to update this with your actual update expression and attribute values
    //     break;
    //   case 'DELETE':
    //     const keyToDelete = {
    //       id: event.pathParameters.id,
    //     };
    //     body = await deleteItem(tableName, keyToDelete);
    //     break;
      default:
        statusCode = 400;
        body = 'Unsupported HTTP method';
    }

    console.log({...body})
  
    const response = {
      statusCode,
      body: JSON.stringify(body),
    };
  
    return response;
  };
  