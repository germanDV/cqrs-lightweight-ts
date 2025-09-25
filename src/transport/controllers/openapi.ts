import {OpenAPIHono} from "@hono/zod-openapi";
import {Scalar} from "@scalar/hono-api-reference";
import AppContext from "../../config/app_context.js";

export function setupOpenAPI(app: OpenAPIHono<AppContext>) {
    app.get("/scalar", Scalar((c) => ({
        url: "/openapi.json",
        pageTitle: "Collateral API Client"
    })))

    app.doc('/openapi.json', {
        openapi: '3.1.0',
        info: {
            title: 'Collateral Arrangements SAPI',
            version: '0.1.0',
            description: 'Collateral Arrangements Standard API',
        },
    })
}
