const AWS = require('aws-sdk')
const { AWSFactory } = require('smelpers')

const dynamodb = AWSFactory(AWS).DynamoDB()

const getAll = async () => {
  const dep = getAll.dependencies()

  const result = await dep.dynamodb.scan({
    TableName: process.env.DYNAMO_TABLE_REPORT,
    FilterExpression: '#status = :status_val',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: { ':status_val': 'active' },
  }).promise()

  return result.Items
}

getAll.dependencies = () => ({
  dynamodb,
})

const getLast = async (report_id) => {
  const dep = getLast.dependencies()

  const result = await dep.dynamodb.get({
    TableName: process.env.DYNAMO_TABLE_REPORT,
    Key: {
      report_id,
    },
  }).promise()

  return result.Item
}

getLast.dependencies = () => ({
  dynamodb,
})

const update = async (
  report_id, stocks,
) => {
  const dep = update.dependencies()
  const params = {
    TableName: process.env.DYNAMO_TABLE_REPORT,
    Key: {
      report_id,
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
  getAll,
  getLast,
  update,
}

