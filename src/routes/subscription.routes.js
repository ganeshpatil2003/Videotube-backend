import { Router } from "express";
import { verifyJWt } from "../middelwares/authenticate.middelware.js";
import {
  getChannelSubscribers,
  getSubscribedChannels,
  toggelSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRoutes = Router();

subscriptionRoutes.use(verifyJWt);
subscriptionRoutes
  .route("/:channelId")
  .patch(toggelSubscription)
  .get(getChannelSubscribers);
subscriptionRoutes.route("/subscribedChannel").get(getSubscribedChannels);

export { subscriptionRoutes };
