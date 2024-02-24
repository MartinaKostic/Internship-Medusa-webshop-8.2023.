"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web_api_1 = require("@slack/web-api");
class OrderConfirmationSubscriber {
    orderService;
    constructor({ eventBusService, orderService }) {
        this.orderService = orderService;
        eventBusService.subscribe("order.placed", this.handleOrderConfirmation);
    }
    handleOrderConfirmation = async (data) => {
        const slackToken = "xoxb-5833707867303-5833876374311-oFLzd90x4DCgbzyQfnR3Zexa";
        const slackClient = new web_api_1.WebClient(slackToken);
        const order = await this.orderService.retrieve(data.id, {
            select: ["discount_total", "subtotal", "total"],
            relations: [
                "customer",
                "items",
                "billing_address",
                "shipping_address",
                "discounts",
                "shipping_methods",
                "payments",
            ],
        });
        const messageText = `
   :team_parrot: Thank You *${order.customer.first_name} ${order.customer.last_name}* for your order! :team_parrot:
  These are your <http://localhost:3000/my-account/orders/${order.display_id}|order> details
  *You saved*: ${(order.discount_total / 1).toFixed(2)} ${order.currency_code} *You payed*: ${(order.total / 1).toFixed(2)} ${order.currency_code}
  `;
        const text = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: messageText,
                },
            },
        ];
        const items = order.items.map((item) => ({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `:parrott:  *${item.title}*`,
            },
            accessory: {
                type: "image",
                image_url: `${item.thumbnail?.replace("http://localhost:9000", "https://735a-93-143-49-68.ngrok.io")}`,
                alt_text: "Product image",
            },
        }));
        const blocks = text.concat(items);
        try {
            // Send a Slack message
            await slackClient.chat.postMessage({
                username: "Red Shop",
                channel: "#test",
                blocks: blocks,
            });
            console.log("Slack notification sent for new order: " + data.id);
        }
        catch (error) {
            console.error("Error sending Slack notification:", error);
        }
    };
}
exports.default = OrderConfirmationSubscriber;
