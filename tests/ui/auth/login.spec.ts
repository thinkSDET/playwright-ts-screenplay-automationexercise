import { test, expect } from "@playwright/test";
import { Actor } from "../../../src/actors/Actor";
import { Login } from "../../../src/tasks/auth/Login";
import { IsLoggedIn } from "../../../src/questions/IsLoggedIn";

test.describe("Login Tests", () => {

    // TC2 - Login with correct credentials
    test("TC2 - Login User with correct email and password", async ({ page }) => {
        const actor = new Actor("ExistingUser", page);
        await actor.attemptsTo(Login.withCredentials("think_test_00111@gmail.com", "Test@123"))
        const loggedIn = await actor.asks(IsLoggedIn.check())
        expect(loggedIn).toBe(true)
    });

    
    // TC3 - Login with incorrect credentials
    test("TC3 - Login User with incorrect email and password", async ({ page }) => {
        const actor = new Actor("WrongCredentials", page);
        await actor.attemptsTo(Login.withCredentials("wrong@test.com", "wrongpassword")); 
        const loggedIn = await actor.asks(IsLoggedIn.check()); expect(loggedIn).toBe(false);
    });

})