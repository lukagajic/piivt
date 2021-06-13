import Ajv from 'ajv';

const ajv = new Ajv();

interface IEditVisit {
    services: {
        visitServiceId: number;
        visitId: number;
        serviceId: number;
        description: string;
    }[];
}


const IEditVisitValidator = ajv.compile({
    type: "object",
    properties: {
        services: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                properties: {
                    visitServiceId: {
                        type: "number",
                        minimum: 0,
                    },
                    visitId: {
                        type: "number",
                        minimum: 1,
                    },
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
                    "visitServiceId",
                    "visitId",
                    "serviceId",
                    "description",
                ],
                additionalProperties: false,
            },
        },
    },
    required: [
        "services"
    ],
    additionalProperties: false
});

export { IEditVisit }
export { IEditVisitValidator }
