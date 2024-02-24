"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const medusa_interfaces_1 = require("medusa-interfaces");
const stripe_1 = __importDefault(require("stripe"));
class StripeService extends medusa_interfaces_1.BaseService {
    stripe;
    constructor() {
        super();
        this.stripe = new stripe_1.default("sk_test_51NryBVF8PqvtCWqVvWgjmPFX0giTXiGmefCjfSNT4Ryb2Zn06t7UIlfTvFYSdJxDXeWO9ymb4BwqdsE4WaZnA8aV00eFeQMdwp", {
            apiVersion: "2022-11-15",
        });
    }
    async retrieveCustomerPaymentMethods(paymentMethodIds) {
        const paymentMethods = [];
        for (const paymentMethodId of paymentMethodIds) {
            const response = await this.stripe.paymentMethods.retrieve(paymentMethodId);
            if (response.id) {
                paymentMethods.push({
                    last4: response.card.last4,
                    name: response.billing_details.name,
                    experation: response.card.exp_month + "/" + response.card.exp_year,
                    brand: response.card.brand,
                });
            }
        }
        const uniquePaymentMethods = (0, lodash_1.uniqBy)(paymentMethods, "last4");
        return uniquePaymentMethods;
    }
}
exports.default = StripeService;
