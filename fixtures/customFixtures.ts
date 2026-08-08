import { mergeTests } from "@playwright/test";
import {test as actorTest} from "../fixtures/actorFixture"
import {test as dataTest} from "../fixtures/dataFixture"

export const test = mergeTests(actorTest,dataTest)

export { expect } from "@playwright/test";