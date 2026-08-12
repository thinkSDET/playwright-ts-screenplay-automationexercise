import { test, expect } from "../../../fixtures/customFixtures";
import { ContactUs } from "../../../src/tasks/common/ContactUs";
import { IsSuccessMessageVisible } from "../../../src/questions/IsSuccessMessageVisible";
import contactUsInput from "../../../test-data/input/contactUsData.json";

test.describe("Contact Us Tests", () => {
 // test.use({ storageState: undefined });

  test("TC6 - Contact Us Form", { tag: ["@P1"] },
    async ({ actor }) => {
      await actor.attemptsTo(
        ContactUs.withDetails(
          contactUsInput.name,
          contactUsInput.email,
          contactUsInput.subject,
          contactUsInput.message
        )
      );

      const isSuccess = await actor.asks(IsSuccessMessageVisible.check());
      expect(isSuccess).toBe(true);
    }
  );
});