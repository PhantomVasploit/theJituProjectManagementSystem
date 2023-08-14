describe('Testing Login Page', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
  })

  it('Should have email and password inputs', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
  })
  it('Should show an error if credentials are wrong', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
  })
  //if one input is empty it should show an error, 
  it('Should show an error if one input is empty', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    
    
  })
})