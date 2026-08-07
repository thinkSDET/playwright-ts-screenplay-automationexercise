import { Actor } from "../../actors/Actor"
import { BrowseTheWeb } from "../../abilities/BrowseTheWeb"
import { LoginLocators } from "../../locators/LoginLocators"
import { Routes } from "../../../utils/routes"

export class Login {

    private email: string
    private password: string

    private constructor(email: string, password: string) {

        this.email = email;
        this.password = password;
    }

    static withCredentials(email: string, password: string): Login {
        return new Login(email, password);
    }

    async performAs(actor: Actor): Promise<void> {
        const page = BrowseTheWeb.as(actor);
        await page.goto(Routes.login)
        await page.locator(LoginLocators.emailField).fill(this.email)
        await page.locator(LoginLocators.passwordField).fill(this.password)
        await page.locator(LoginLocators.loginButton).click()
    }
}
