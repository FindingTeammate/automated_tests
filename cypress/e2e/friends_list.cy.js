import { slowCypressDown } from "cypress-slow-down";

slowCypressDown();

describe("login", () => {
  it("User can view his/her friends list", () => {
    // first user logs in
    cy.visit("https://finding-teammates.netlify.app/");
    cy.findByRole("textbox").type("keri39");
    cy.findByPlaceholderText(/111/i).type("W206ornorn");
    cy.findByRole("button", { name: /login/i }).click();

    // user goes to his/her own friends page
    cy.findByRole("link", { name: /friends/i, hidden: true }).click();

    // user view rejected requests
    cy.findByText(/rejected requests/i).click();

    //user can view sent requests
    cy.findByText(/sent requests/i).click();
  });
});
