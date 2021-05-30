import Ajv from 'ajv';

interface IDoctorLogin {
    email: string;
    password: string;
}

const ajv = new Ajv();

const IDoctorLoginValidator = ajv.compile({
    type: "object",
    properties: {
        email: {
            type: "string",
            minLength: 8,
            maxLength: 255
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 255
        }
    },
    required: ["email", "password"],
    additionalProperties: false
});

export { IDoctorLogin }
export { IDoctorLoginValidator }
