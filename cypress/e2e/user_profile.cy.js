import { slowCypressDown } from "cypress-slow-down";

slowCypressDown();

describe("login", () => {
  it("User can view his/her own profile", () => {
    // first user logs in
    cy.visit("https://finding-teammates.netlify.app/");
    cy.findByRole("textbox").type("keri39");
    cy.findByPlaceholderText(/111/i).type("W206ornorn");
    cy.findByRole("button", { name: /login/i }).click();

    // user goes to his/her own profile
    cy.findByRole("link", { name: /me/i }).click();

    // user can click edit details
    cy.findByRole("button", { name: /edit details/i, hidden: true }).click();
    cy.findByRole("button", { name: /update/i }).click();
  });
});
