import {Page} from '@playwright/test'

export class Actor{

    private page :Page
    private name:string

    constructor(name:string,page:Page){
        this.name=name
        this.page=page
    }

    getPage():Page{
        return this.page
    }

    getName():string{
        return this.name
    }

    async attemptsTo(...tasks:any[]):Promise<void>{
        for(const task of tasks){
            await task.performAs(this)
        }
    }

    async asks(question:any):Promise<any>{
        return await question.answeredBy(this)
    }
}
