import {Page} from '@playwright/test'
import { Actor } from '../actors/Actor'

export class BrowseTheWeb{
    private page :Page

    constructor(page:Page){
        this.page=page
    }

    static as(actor :Actor):Page{
        return actor.getPage()
    }
}