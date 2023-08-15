describe('Checking if all features exists', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
  })
  it('should have a link to the Homepage', () => { 
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('a[href="../index.html"]').should('exist');
  })
  it('Should be in the right location', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.location('pathname').should('eq', '/client/Auth/login.html');
  })
  
  it ('should have email and password inputs', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
  })

  it ('should have a submit button and should be Clickable', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('button[type="submit"]').should('exist');
  })
  it('should have a link to the register page', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('a[href="../Auth/signup.html"]').should('exist');
  })
  it('should have a link to the forgot password page', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('a[href="../Auth/forgotpwd.html"]').should('exist');
  })
})


describe('Checking if all inputs function as required', () => {
  it('should show an error if one field is empty', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('input[name="email"]')
    cy.get('input[name="password"]').type('Test1234.');
    cy.get('button[type="submit"]').click();
  })
  it('should show an error if the credentials are invalid', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('Test1234.');
    cy.get('button[type="submit"]').click();
  })
  it('should show an error if the email is in the wrong format', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('input[name="email"]').type('testgmail.com');
    cy.get('input[name="password"]').type('Test1234.');
    cy.get('button[type="submit"]').click();
  })
  it('should show an error if the credentials are wrong', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('Test1234.');
    cy.get('button[type="submit"]').click();
   })
  it('should be able to login succesfully', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('input[name="email"]').type('rachaelmuga2@gmail.com');
    cy.get('input[name="password"]').type('Test1234.');
    cy.get('button[type="submit"]').click();
  })
})


describe('Checking if all links work', () => {
  it('should be able to navigate to the homepage', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('a[href="../index.html"]').click();
  })
  it('should be able to navigate to the register page', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('a[href="../Auth/signup.html"]').click();
  })
  it('should be able to navigate to the forgot password page', () => {
    cy.visit('http://127.0.0.1:5500/client/Auth/login.html');
    cy.get('a[href="../Auth/forgotpwd.html"]').click();
  })
})
