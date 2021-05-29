import Ajv from 'ajv';

const ajv = new Ajv();

interface IEditVisit {
    description: string;
    editorDoctorId: number;
    services: {
        serviceId: number;
        description: string;
    }[];
}


const IEditVisitValidator = ajv.compile({
    type: "object",
    properties: {
        description: {
            type: "string",
            minLength: 2,
            maxLength: 64 * 1024,
        },
        editorDoctorId: {
            type: "integer",
            minimum: 1,
        },
        services: {
            type: "array",
            minItems: 1,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    serviceId: {
                        type: "number",
                        minimum: 1,
                    },
                    description: {
                        type: "string",
                        minLength: 2,
                        maxLength: 64 * 1024,
                    }
                },
                required: [
                    "serviceId",
                    "description",
                ],
                additionalProperties: false,
            },
        },
    },
    required: [
        "description",
        "editorDoctorId",
        "services"
    ],
    additionalProperties: false
});

export { IEditVisit }
export { IEditVisitValidator }
