import { UtilsShared } from "../../../shared/utils/utils.shared";
import { SubscriptionEntity } from "../entities/subscription.entity";

export class SubscriptionService {
  public createSubscription = async (email: string) => {
    try {
      const subscription = new SubscriptionEntity();

      if (!(await UtilsShared.validateEmail(email))) throw new Error(`Invalid email`);

      subscription.email = email;

      return await subscription.save();
    } catch (err) {
      throw new Error(`Failed to create subscription: ${err}`);
    }
  };
}
