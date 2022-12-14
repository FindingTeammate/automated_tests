import { slowCypressDown } from "cypress-slow-down";

slowCypressDown();

describe("login", () => {
  it("User can login", () => {
    cy.visit("https://finding-teammates.netlify.app/");
    cy.findByRole("textbox").type("keri39");
    cy.findByPlaceholderText(/111/i).type("W206ornorn");
    cy.findByRole("button", { name: /login/i }).click();
  });
});
