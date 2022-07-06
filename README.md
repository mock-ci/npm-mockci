# [MockCI](https://mockci.cloud) npm package

This is the npm package to use the MockCI API.

[MockCI](https://mockci.cloud) creates a DynamoDB compatible endpoint that you can use and throwaway.
This allows you to test all you DynamoDB related code locally with minimal changes.

install:
```bash
npm install mockci
# or
yarn add mockci
```

example usage:

```ts
import { MockCIPrefab, MockCISession } from 'mockci'
import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";

type DynamoDBItem = {
    id: string
    value: string
}

async function generateDdbEndpoint() {
    const prefab: MockCIPrefab = {
        "dynamodb": {
            "tables": [
                {
                    "seedData": [
                        {
                            "id": generateName(),
                            "value": "seeded value"
                        }
                    ],
                    "name": "generic-table",
                    "attributes": [
                        { "name": "id", "type": "S" },
                    ],
                    "hashKey": "id"
                }
            ]
        }
    }
    const endpointBlob = await MockCISession.start({ prefab })
    return endpointBlob.dynamodbEndpoint
}

async function listDDBItems(ddbClient: DynamoDBClient): Promise<DynamoDBItem[]> {
    const params: ScanCommandInput = {
        TableName: 'generic-table',
    }
    const data = await ddbClient.send(new ScanCommand(params));
    return data.Items.map((element) => ({
        id: element.id.S,
        value: element.value.S,
    }))
}

//this is optional, you can try out the DynamoDB mock without using an API key,
//if you reach the api limits of anonymous sessions,
//head to [the [MockCI]()](https://mockci.cloud/signup) website to get a free API key.
MockCISession.setAPIKey('YOUR_API_KEY_HERE')

generateDdbEndpoint()
.then((endpoint) => {
    let ddbClient = new DynamoDBClient({
        region: 'us-east-1',
        endpoint,
        credentials: {
            //if you're in the browser this is required (but can be any value)
            //if you're in Node and have a local AWS profile configure, this is optional
            accessKeyId: 'anyvalueworks',
            secretAccessKey: 'anyvalueworks',
        }
    })
    return listDDBItems(ddbClient)
})
.then(console.log)
```