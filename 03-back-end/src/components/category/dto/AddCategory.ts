import Ajv from "ajv";

interface IAddCategory {
    name: string;
}

const ajv = new Ajv();

const IAddCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64
        }
    },
    required: [
        "name"
    ],
    additionalProperties: false
});

export { IAddCategory }
export { IAddCategoryValidator }
