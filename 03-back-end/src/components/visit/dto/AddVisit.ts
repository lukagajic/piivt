import Ajv from 'ajv';

const ajv = new Ajv();

interface IAddVisit {
    patientId: number;
    visitedAt: string;
    services: {
        serviceId: number;
        description: string;
    }[];
}


const IAddVisitValidator = ajv.compile({
    type: "object",
    properties: {
        patientId: {
            type: "integer",
            minimum: 1,
        },
        visitedAt: {
            type: "string",
            minLength: 10,
            maxLength: 10
        },
        services: {
            type: "array",
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
        "patientId",
        "visitedAt",
        "services"
    ],
    additionalProperties: false
});

export { IAddVisit }
export { IAddVisitValidator }
