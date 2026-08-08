import { mergeTests } from "@playwright/test";
import {test as actorTest} from "../fixtures/actorFixture"
import {test as dataTest} from "../fixtures/dataFixture"
import {test as authTest} from "../fixtures/authFixture"

export const test = mergeTests(actorTest,dataTest,authTest)

export { expect } from "@playwright/test";