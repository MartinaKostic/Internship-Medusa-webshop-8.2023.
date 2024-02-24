Object.defineProperty(exports, "__esModule", { value: true });
import insightsClient from "search-insights";
const api = process.env.ALGOLIA_ADMIN_API_KEY;
const appId = process.env.ALGOLIA_APP_ID;
const searchApi = process.env.ALGOLIA_SEARCHONLY_API_KEY;
const algoliaIndexName = "products";

insightsClient("init", {
  appId: appId,
  apiKey: api,
});

class OrderToAlgoliaSubscriber {
  orderService: {
    retrieve: (
      arg0: any,
      arg1: { select: string[]; relations: string[] }
    ) => any;
  };
  constructor({ eventBusService, orderService }) {
    this.orderService = orderService;
    eventBusService.subscribe("order.placed", this.handleOrder);
  }

  handleOrder = async (data: { id: any }) => {
    const order = await this.orderService.retrieve(data.id, {
      select: ["id", "created_at", "customer", "items"],
      relations: ["customer", "items", "items.variant"],
    });
    console.log(order);
    insightsClient("convertedObjectIDs", {
      userToken: order.customer_id,
      index: algoliaIndexName,
      eventName: "Order Placed",
      objectIDs: order.items.map((item) => item.variant.product_id),
    });
  };
}
exports.default = OrderToAlgoliaSubscriber;
