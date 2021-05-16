import Ajv from "ajv";

interface IAddService {
    name: string;
    description: string;
    price: number;
    priceForChildren: number;
    priceForSeniors: number;
    categoryId: number;
}

const ajv = new Ajv();

const IAddServiceValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64
        },
        description: {
            type: "string",
            minLength: 2,
            maxLength: 1500
        },
        price: {
            type: "integer",
            minimum: 150,
            maximum: 150000
        },
        priceForChildren: {
            type: "integer",
            minimum: 150,
            maximum: 150000
        },
        priceForSeniors: {
            type: "integer",
            minimum: 150,
            maximum: 150000
        },
        categoryId: {
            type: "integer",
            minimum: 1,
        }
    },
    required: [
        "name", 
        "description", 
        "price", 
        "priceForChildren", 
        "priceForSeniors", 
        "categoryId"
    ],
    additionalProperties: false
});

export { IAddService }
export { IAddServiceValidator }
