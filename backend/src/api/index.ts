import { OrderService } from "@medusajs/medusa";
import { getConfigFile } from "medusa-core-utils";
import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import cors from "cors";
import express, { Router } from "express";
import bodyParser from "body-parser";

export default (rootDirectory: string) => {
  const router = Router();
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  );
  const { projectConfig } = configModule;

  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  };

  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  //GET ORDERS
  router.use(cors(storeCorsOptions));
  router.get(
    "/store/retrieve-order/:id",
    cors(storeCorsOptions),
    async (req, res) => {
      const orderService: OrderService = req.scope.resolve("orderService");

      const order = await orderService.retrieve(req.params.id, {
        relations: ["billing_address", "shipping_address"],
      });

      res.json({ order });
    }
  );

  //PAYMENT METHODS
  router.post(
    "/store/customer-payment-methods/:id",
    cors(storeCorsOptions),
    async (req, res) => {
      try {
        const paymentMethodIds = req.body.paymentmethod_ids;
        // console.log(paymentMethodIds);
        const stripeService = req.scope.resolve("stripeService");
        const paymentMethod =
          await stripeService.retrieveCustomerPaymentMethods(paymentMethodIds);
        // console.log(paymentMethod);
        res.json({ paymentMethod });
      } catch (error) {
        console.error("Server Error:", error);
      }
    }
  );
  return router;
};
