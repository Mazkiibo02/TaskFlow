import { getFormSettingsContainer } from "../config/cosmos";
import { FormSettings, FormSettingsSchema } from "../models/FormSettings";
import { AppError } from "../utils/errorHandler";

// Usually, we'd have one setting per organization. If no orgId is passed, we'll use a default "default-org".
export const getFormSettings = async (organizationId: string = "default-org"): Promise<FormSettings> => {
    const container = await getFormSettingsContainer();
    
    const query = "SELECT * FROM c WHERE c.organizationId = @orgId";
    const parameters = [{ name: "@orgId", value: organizationId }];

    const { resources } = await container.items.query({ query, parameters }).fetchAll();
    
    if (resources.length > 0) {
        return resources[0] as FormSettings;
    }

    // Return empty settings if none exist
    return {
        organizationId,
        fields: []
    };
};

export const updateFormSettings = async (organizationId: string = "default-org", settingsData: unknown): Promise<FormSettings> => {
    const validatedData = FormSettingsSchema.parse(settingsData);
    const container = await getFormSettingsContainer();
    
    // Ensure orgId is set
    validatedData.organizationId = organizationId;

    const query = "SELECT * FROM c WHERE c.organizationId = @orgId";
    const parameters = [{ name: "@orgId", value: organizationId }];
    const { resources } = await container.items.query({ query, parameters }).fetchAll();

    let savedResource;
    if (resources.length > 0) {
        const existingId = resources[0].id;
        const { resource } = await container.item(existingId, organizationId).replace({ ...resources[0], ...validatedData });
        savedResource = resource;
    } else {
        const { resource } = await container.items.create(validatedData);
        savedResource = resource;
    }

    return savedResource as FormSettings;
};
