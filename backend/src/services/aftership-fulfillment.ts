import axios from "axios";
import { FulfillmentService } from "medusa-interfaces";

class AftershipFulfillmentService extends FulfillmentService {
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
    const rates = await axios
      .request(options as object)
      .then((data) => data.data);
    //console.log(rates.data.couriers[0]);
    const option = rates.data.couriers.map((courier) => {
      return {
        id: courier.name,
      };
    });
    return option;
  }
  async createFulfillment(
    data: any,
    items: any,
    order: any,
    fulfillment: any
  ) {}
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

export default AftershipFulfillmentService;
