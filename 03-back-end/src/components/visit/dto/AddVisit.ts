import Ajv from 'ajv';

const ajv = new Ajv();

interface IAddVisit {
    description: string;
    patientId: number;
    doctorId: number;
    services: {
        serviceId: number;
        description: string;
    }[];
}


const IAddVisitValidator = ajv.compile({
    type: "object",
    properties: {
        description: {
            type: "string",
            minLength: 2,
            maxLength: 64 * 1024,
        },
        patientId: {
            type: "integer",
            minimum: 1,
        },
        doctorId: {
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
        "patientId",
        "doctorId",
        "services"
    ],
    additionalProperties: false
});

export { IAddVisit }
export { IAddVisitValidator }
