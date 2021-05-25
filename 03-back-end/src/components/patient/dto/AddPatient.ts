import Ajv from "ajv";

interface IAddPatient {
    forename: string;
    surname: string;
    bornAt: Date;
    gender: "male" | "female";
    email: string;
    personalIdentityNumber: string
    phoneNumber: string;
    address: string;
    isActive: boolean;
}

const ajv = new Ajv();

const IAddPatientValidator = ajv.compile({
    type: "object",
    properties: {
        forename: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        surname: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        // Ajv nema validator za datume
        // Svakako ISO datum je string koji ima format npr 2020-11-11 od 10 karaktera
        // Posto je u bazi postavljen tip Date nijedan drugi string od 10 karaktera osim ovog nece biti prihvacen
        bornAt: {
            type: "string",
            minLength: 10,
            maxLength: 10,
        },
        gender: {
            type: "string",
            enum: ["male", "female"]
        },
        email: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
        personalIdentityNumber: {
            type: "string",
            minLength: 13,
            maxLength: 13,
        },
        phoneNumber: {
            type: "string",
            minLength: 5,
            maxLength: 24,
        },
        address: {
            type: "string",
            minLength: 10,
            maxLength: 64 * 1024,
        },       
        isActive: {
            type: "boolean"
        }
    },
    required: [
        "forename", "surname", "bornAt", "gender", "email", "personalIdentityNumber", "phoneNumber", "address", "isActive"
    ],
    additionalProperties: false
});

export { IAddPatient }
export { IAddPatientValidator }
