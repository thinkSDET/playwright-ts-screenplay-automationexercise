import { Actor } from "../actors/Actor";
import { BrowseTheWeb } from "../abilities/BrowseTheWeb";

export class GetPageText {
  private locator: string;

  private constructor(locator: string) {
    this.locator = locator;
  }

  static of(locator: string): GetPageText {
    return new GetPageText(locator);
  }

  async answeredBy(actor: Actor): Promise<string> {
    const page = BrowseTheWeb.as(actor);
    return await page.locator(this.locator).innerText();
  }
}