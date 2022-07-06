export interface MockCINamedPrefab {
    name: string
}
export interface MockCIPrefab {
    dynamodb: DynamoDBConfig
}

export interface DynamoDBConfig {
    tables: DynamoDBTable[]
}

export interface DynamoDBTable {
    name: string
    hashKey: string
    rangeKey?: string
    attributes: DynamoDBAttribute[]
    indexes?: DynamoDBIndex[]
    seedData?: DynamoDBTableSeedData[]
}

export interface DynamoDBAttribute {
    name: string
    type: string
}

export interface DynamoDBIndex {
    name: string
    hashKey: string
    rangeKey?: string
}

export type DynamoDBTableSeedData = {
    [key: string]: any
}

export type StartSessionInput = {
    //if given, this overrides the API key set using setAPIKey
    apiKey?: string
    prefab: MockCIPrefab | MockCINamedPrefab
}

export interface StartSessionOutput {
    sessionId: string
    dynamodbEndpoint: string
    ready: true
}

export interface SessionsFuncs {
    //set a global API key to be used by all future calls to start()
    setAPIKey(apiKey: string): void
    checkStatus(sessionId: string): Promise<boolean>
    start(input: StartSessionInput): Promise<StartSessionOutput>
    end(sessionId: string): Promise<void>
}

export const MockCISession: SessionsFuncs