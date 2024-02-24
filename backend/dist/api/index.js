"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_core_utils_1 = require("medusa-core-utils");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
exports.default = (rootDirectory) => {
    const router = (0, express_1.Router)();
    const { configModule } = (0, medusa_core_utils_1.getConfigFile)(rootDirectory, "medusa-config");
    const { projectConfig } = configModule;
    const storeCorsOptions = {
        origin: projectConfig.store_cors.split(","),
        credentials: true,
    };
    router.use(express_1.default.json());
    router.use(express_1.default.urlencoded({ extended: true }));
    //GET ORDERS
    router.use((0, cors_1.default)(storeCorsOptions));
    router.get("/store/retrieve-order/:id", (0, cors_1.default)(storeCorsOptions), async (req, res) => {
        const orderService = req.scope.resolve("orderService");
        const order = await orderService.retrieve(req.params.id, {
            relations: ["billing_address", "shipping_address"],
        });
        res.json({ order });
    });
    //PAYMENT METHODS
    router.post("/store/customer-payment-methods/:id", (0, cors_1.default)(storeCorsOptions), async (req, res) => {
        try {
            const paymentMethodIds = req.body.paymentmethod_ids;
            // console.log(paymentMethodIds);
            const stripeService = req.scope.resolve("stripeService");
            const paymentMethod = await stripeService.retrieveCustomerPaymentMethods(paymentMethodIds);
            // console.log(paymentMethod);
            res.json({ paymentMethod });
        }
        catch (error) {
            console.error("Server Error:", error);
        }
    });
    return router;
};
