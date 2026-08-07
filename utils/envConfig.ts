const ENV = process.env.ENV || "qa";
console.log("Current ENV:",ENV)
const environments: Record<string, string> = {
  qa: "https://www.automationexercise.com",
  staging: "https://staging.automationexercise.com",
  prod: "https://www.automationexerciseProd.com",
};

export const config = {
  baseURL: environments[ENV],
  env: ENV,
};