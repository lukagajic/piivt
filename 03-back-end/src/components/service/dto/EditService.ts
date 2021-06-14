import Ajv from "ajv";

interface IEditService {
    name: string;
    description: string;
    catalogueCode: string;
    price: number;
    priceForChildren: number;
    priceForSeniors: number;
    categoryId: number;
}

const ajv = new Ajv();

const IEditServiceValidator = ajv.compile({
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
            maxLength: 255
        },
        catalogueCode: {
            type: "string",
            minLength: 7,
            maxLength: 7
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
        "catalogueCode",
        "price", 
        "priceForChildren", 
        "priceForSeniors", 
        "categoryId"
    ],
    additionalProperties: false
});

export { IEditService }
export { IEditServiceValidator }
