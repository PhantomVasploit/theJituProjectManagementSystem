/// <references types="Cypress" />

describe('Main Dashboard', {
    baseUrl:"http://127.0.0.1:5500/client/"
}, () => {

    it("Should display the main dashboard", () => {
        cy.visit("dashboard/dashboard.html");
    });

});
