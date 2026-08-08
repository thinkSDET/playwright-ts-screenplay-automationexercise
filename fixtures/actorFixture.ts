import { test as base } from "@playwright/test";
import { Actor } from "../src/actors/Actor";

type CustomFixtures = {
  actor: Actor;
};

export const test = base.extend<CustomFixtures>({
  actor: async ({ page }, use) => {
    const actor = new Actor("ExistingUser", page);
    await use(actor);
  },
});
