import Ajv from 'ajv';

const ajv = new Ajv();

interface IAddVisit {
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
        "patientId",
        "doctorId",
        "services"
    ],
    additionalProperties: false
});

export { IAddVisit }
export { IAddVisitValidator }
