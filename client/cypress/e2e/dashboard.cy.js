///<reference types="cypress" />

describe('Dashboard Tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
        cy.get('#email').type('devop047@gmail.com');
        cy.get('#password').type('Gift1234');
        cy.get('.loginBtn').click();
    });

    it('should display all dash stats perfectly', () => {
        cy.get('#users_count').should('be.visible');
        cy.get('#projects_count').should('be.visible');
        cy.get('#completed_projects_count').should('be.visible');
        cy.get('#pending_projects_count').should('be.visible');
    });

    it('should display all unapproved users', () => {
        cy.get('#unapproved-users-table').should('be.visible');
    });

    it('should display all recent projects', () => {
        cy.get('#recent-projects-table').should('be.visible');
    });

    it("Project Allocation should work", () => {
        cy.get('#recent-projects-table > :nth-child(1) > :nth-child(4) > .btn').click();
        cy.url().should('include', '/client/dashboard/availableUsers.html?id=');
    });
});