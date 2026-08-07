import { Actor } from "../actors/Actor";
import { BrowseTheWeb } from "../abilities/BrowseTheWeb";
import { LoginLocators } from "../locators/LoginLocators";

export class IsLoggedIn {

    private constructor() { }

    static check(): IsLoggedIn {
        return new IsLoggedIn();
    }

    async answeredBy(actor: Actor): Promise<boolean> {
        const page = BrowseTheWeb.as(actor);
        return await page.locator(LoginLocators.loggedInUser).isVisible();
    }
}
