"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const medusa_interfaces_1 = require("medusa-interfaces");
class AftershipFulfillmentService extends medusa_interfaces_1.FulfillmentService {
    static identifier = "aftership-fulfillment";
    constructor(container, options) {
        super();
        // you can access options here
    }
    async getFulfillmentOptions() {
        //console.log("options");
        const options = {
            method: "GET",
            url: "https://sandbox-api.aftership.com/postmen/v3/couriers",
            headers: {
                "Content-Type": "application/json",
                "as-api-key": process.env.AFTERSHIP_API_KEY,
            },
        };
        const rates = await axios_1.default
            .request(options)
            .then((data) => data.data);
        //console.log(rates.data.couriers[0]);
        const option = rates.data.couriers.map((courier) => {
            return {
                id: courier.name,
            };
        });
        return option;
    }
    async createFulfillment(data, items, order, fulfillment) { }
    async validateOption(data) {
        return data.id == "aftership-fulfillment";
    }
    async validateFulfillmentData(optionData, data, cart) {
        if (data.id !== "aftership-fulfillment") {
            throw new Error("invalid data");
        }
        return {
            ...data,
        };
    }
}
exports.default = AftershipFulfillmentService;
