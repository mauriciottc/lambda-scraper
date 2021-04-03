const AWS = require('aws-sdk')
const { AWSFactory } = require('smelpers')

const dynamodb = AWSFactory(AWS).DynamoDB()

const getLast = async () => {
  const dep = getLast.dependencies()

  const result = await dep.dynamodb.get({
    TableName: process.env.DYNAMO_TABLE_REPORT,
    Key: {
      report_id: 'valor',
    },
  }).promise()

  return result.Item
}

getLast.dependencies = () => ({
  dynamodb,
})

const update = async (
  stocks,
) => {
  const dep = update.dependencies()
  const params = {
    TableName: process.env.DYNAMO_TABLE_REPORT,
    Key: {
      report_id: 'valor',
    },
    UpdateExpression: 'set updated_at = :updated_at, stocks = :stocks',
    ExpressionAttributeValues: {
      ':stocks': stocks,
      ':updated_at': new Date().toISOString(),
    },
  }

  return dep.dynamodb.update(params).promise()
}

update.dependencies = () => ({
  dynamodb,
})

module.exports = {
  getLast,
  update,
}

