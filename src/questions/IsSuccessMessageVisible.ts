import { Actor } from "../actors/Actor";
import { BrowseTheWeb } from "../abilities/BrowseTheWeb";
import { ContactUsLocators } from "../locators/ContactUsLocators";

export class IsSuccessMessageVisible {
  private constructor() {}

  static check(): IsSuccessMessageVisible {
    return new IsSuccessMessageVisible();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = BrowseTheWeb.as(actor);
    return await page
      .locator(ContactUsLocators.successMessage)
      .isVisible();
  }
}