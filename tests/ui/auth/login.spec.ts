import { test, expect } from "../../../fixtures/customFixtures";
import { Login } from "../../../src/tasks/auth/Login";
import { IsLoggedIn } from "../../../src/questions/IsLoggedIn";
import { GetPageText } from "../../../src/questions/GetPageText";
import { LoginLocators } from "../../../src/locators/LoginLocators";

test.describe("Login Tests", () => {
    test.use({ storageState: { cookies: [], origins: [] } })
    // TC2 - Login with correct credentials
    test("TC2 - Login User with correct email and password",{tag :["@smoke","@regression"]} ,async ({ actor,loginInput,loginExpected }) => {
        await actor.attemptsTo(Login.withCredentials(loginInput.validuser.email, loginInput.validuser.password))
        const loggedIn = await actor.asks(IsLoggedIn.check())
        expect(loggedIn).toBe(true)
        const pageText =  await actor.asks(GetPageText.of(LoginLocators.loggedInUser))
        expect(pageText).toContain(loginExpected.validUser.successMessage)
    });

    
    // TC3 - Login with incorrect credentials
    test.use({ storageState: { cookies: [], origins: [] } })
    test("TC3 - Login User with incorrect email and password", {tag:["@sanity"]} ,async ({ actor,loginInput,loginExpected }) => {
        await actor.attemptsTo(Login.withCredentials(loginInput.invalidUser.email, loginInput.invalidUser.password)); 
        const loggedIn = await actor.asks(IsLoggedIn.check()); 
        expect(loggedIn).toBe(false);
        const pageText =  await actor.asks(GetPageText.of(LoginLocators.errorMessage))
        expect(pageText).toContain(loginExpected.invalidUser.errorMessage)
    });

})