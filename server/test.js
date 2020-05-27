const { DynamoDB } = require('aws-sdk')

const DynamoClient = new DynamoDB({
  accessKeyId: 'test',
  secretAccessKey: 'test',
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

// DynamoClient.deleteTable({
//   TableName: 'CHAT-ROOMS'
// })
//   .promise()
//   .then(() => console.log('Good'))
//   .catch(console.error)

// DynamoClient.createTable({
//   TableName: 'CHAT-ROOMS',
//   KeySchema: [
//     {
//       AttributeName: 'PK',
//       KeyType: 'HASH'
//     },
//     {
//       AttributeName: 'SK',
//       KeyType: 'RANGE'
//     }
//   ],
//   AttributeDefinitions: [
//     {
//       AttributeName: 'PK',
//       AttributeType: 'S'
//     },
//     {
//       AttributeName: 'SK',
//       AttributeType: 'S'
//     }
//   ],
//   ProvisionedThroughput: {
//     ReadCapacityUnits: 100,
//     WriteCapacityUnits: 100
//   }
// })
//   .promise()
//   .then(() => console.log('Good'))
//   .catch(console.error)

// DynamoClient.updateTable({
//   TableName: 'CHAT-ROOMS',
//   AttributeDefinitions: [
//     {
//       AttributeName: 'GSI1PK',
//       AttributeType: 'S'
//     },
//     {
//       AttributeName: 'GSI1SK',
//       AttributeType: 'S'
//     }
//   ],
//   GlobalSecondaryIndexUpdates: [
//     {
//       Create: {
//         IndexName: 'GSI1PK-GSI1SK-index',
//         KeySchema: [
//           {
//             AttributeName: 'GSI1PK',
//             KeyType: 'HASH'
//           },
//           {
//             AttributeName: 'GSI1SK',
//             KeyType: 'RANGE'
//           }
//         ],
//         Projection: {
//           ProjectionType: 'ALL'
//         }
//       }
//     }
//   ]
// })
//   .promise()
//   .then(r => console.log('Good', r))
