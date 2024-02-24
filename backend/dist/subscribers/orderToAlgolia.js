"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
Object.defineProperty(exports, "__esModule", { value: true });
const search_insights_1 = __importDefault(require("search-insights"));
const api = process.env.ALGOLIA_ADMIN_API_KEY;
const appId = process.env.ALGOLIA_APP_ID;
const searchApi = process.env.ALGOLIA_SEARCHONLY_API_KEY;
const algoliaIndexName = "products";
(0, search_insights_1.default)("init", {
    appId: appId,
    apiKey: api,
});
class OrderToAlgoliaSubscriber {
    orderService;
    constructor({ eventBusService, orderService }) {
        this.orderService = orderService;
        eventBusService.subscribe("order.placed", this.handleOrder);
    }
    handleOrder = async (data) => {
        const order = await this.orderService.retrieve(data.id, {
            select: ["id", "created_at", "customer", "items"],
            relations: ["customer", "items", "items.variant"],
        });
        console.log(order);
        (0, search_insights_1.default)("convertedObjectIDs", {
            userToken: order.customer_id,
            index: algoliaIndexName,
            eventName: "Order Placed",
            objectIDs: order.items.map((item) => item.variant.product_id),
        });
    };
}
exports.default = OrderToAlgoliaSubscriber;
