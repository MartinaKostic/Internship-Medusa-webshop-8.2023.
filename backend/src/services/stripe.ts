import { uniqBy } from "lodash";
import { BaseService } from "medusa-interfaces";
import stripe, { Stripe } from "stripe";

class StripeService extends BaseService {
  protected stripe: Stripe;
  constructor() {
    super();
    this.stripe = new stripe(
      "sk_test_51NryBVF8PqvtCWqVvWgjmPFX0giTXiGmefCjfSNT4Ryb2Zn06t7UIlfTvFYSdJxDXeWO9ymb4BwqdsE4WaZnA8aV00eFeQMdwp",
      {
        apiVersion: "2022-11-15",
      }
    );
  }
  async retrieveCustomerPaymentMethods(paymentMethodIds: string[]) {
    const paymentMethods = [];

    for (const paymentMethodId of paymentMethodIds) {
      const response = await this.stripe.paymentMethods.retrieve(
        paymentMethodId
      );
      if (response.id) {
        paymentMethods.push({
          last4: response.card.last4,
          name: response.billing_details.name,
          experation: response.card.exp_month + "/" + response.card.exp_year,
          brand: response.card.brand,
        });
      }
    }
    const uniquePaymentMethods = uniqBy(paymentMethods, "last4");
    return uniquePaymentMethods;
  }
}
export default StripeService;
