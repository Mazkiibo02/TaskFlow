import { CosmosClient, Database, Container } from "@azure/cosmos";

// Use Managed Identity in production to avoid credential exposure in configuration or logs
const connectionString = process.env.COSMOS_DB_CONN_STRING || "";
if (!connectionString) {
    throw new Error("COSMOS_DB_CONN_STRING is not defined");
}

// Connection pooling is handled automatically by CosmosClient, reuse this single instance
export const cosmosClient = new CosmosClient(connectionString);

export const getDatabase = async (): Promise<Database> => {
    const { database } = await cosmosClient.databases.createIfNotExists({ id: "TaskApp" });
    return database;
};

export const getTasksContainer = async (): Promise<Container> => {
    const database = await getDatabase();
    // Partition key must match exact query patterns to avoid cross-partition query performance hits
    const { container } = await database.containers.createIfNotExists({ 
        id: "Tasks",
        partitionKey: { paths: ["/id"] }
    });
    return container;
};

export const getFormSettingsContainer = async (): Promise<Container> => {
    const database = await getDatabase();
    const { container } = await database.containers.createIfNotExists({ 
        id: "FormSettings",
        partitionKey: { paths: ["/organizationId"] }
    });
    return container;
};
