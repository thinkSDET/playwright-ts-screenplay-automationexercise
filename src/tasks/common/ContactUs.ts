import { Actor } from "../../actors/Actor"
import { BrowseTheWeb } from "../../abilities/BrowseTheWeb"
import { ContactUsLocators } from "../../locators/ContactUsLocators"
import { Routes } from "../../../utils/routes"
import path from "path"

export class ContactUs {
  private name: string;
  private email: string;
  private subject: string;
  private message: string;

  private constructor(
    name: string,
    email: string,
    subject: string,
    message: string
  ) {
    this.name = name;
    this.email = email;
    this.subject = subject;
    this.message = message;
  }

  static withDetails(
    name: string,
    email: string,
    subject: string,
    message: string
  ): ContactUs {
    return new ContactUs(name, email, subject, message);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = BrowseTheWeb.as(actor);

    await page.goto(Routes.home);
    page.on('dialog',async listenDialogue=>{
         console.log( listenDialogue.message())
         await listenDialogue.accept()
    })
    await page.locator(ContactUsLocators.contactUsButton).click();
    await page.locator(ContactUsLocators.nameField).fill(this.name);
    await page.locator(ContactUsLocators.emailField).fill(this.email);
    await page.locator(ContactUsLocators.subjectField).fill(this.subject);
    await page.locator(ContactUsLocators.messageField).fill(this.message);

    await page.locator(ContactUsLocators.fileUpload).setInputFiles(
      path.join(__dirname, "../../../test-data/files/test.txt")
    );

    await page.locator(ContactUsLocators.submitButton).click();
  }
}