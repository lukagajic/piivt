import Ajv from "ajv";

interface IAddDoctor {
    forename: string;
    surname: string;
    email: string;
    username: string;
    password: string;
    bornAt: Date;
    gender: "male" | "female";
    title: "magistar" | "specijalizant" | "doktor" | "docent" | "primarijus";
    phoneNumber: string;
}

const ajv = new Ajv();

const IAddDoctorValidator = ajv.compile({
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
        email: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
        username: {
            type: "string",
            minLength: 2,
            maxLength: 100,
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 255,
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
        title: {
            type: "string",
            enum: [ "magistar", "specijalizant", "doktor", "docent", "primarijus" ]
        },
        phoneNumber: {
            type: "string",
            minLength: 5,
            maxLength: 24,
        }
    },
    required: [
        "forename", "surname", "email", "username", "password", "bornAt", "gender", "title", "phoneNumber"
    ],
    additionalProperties: false
});

export { IAddDoctor }
export { IAddDoctorValidator }
