
describe('All features exist', () => {
    it('passes', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html');
      })
      it('Should be in the right location', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html');
        cy.location('pathname').should('eq', '/client/Auth/signup.html');
      })
    it('should have all inputs', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#fullname').should('exist')
        cy.get('#email').should('exist')
        cy.get('#password').should('exist')
        cy.get('#re-enterpassword').should('exist')   
})
    it('should have all buttons', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#signupBtn').should('exist')
    })
    it('should have all links', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#loginhere').should('exist')
        cy.get('#homepage').should('exist')

    })
})

describe('All inputs are functioning', () => {
    it('should not have empty fields', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#signupBtn').click()
})
    it('should show an error if only one name inputed', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#fullname').type('John ')
        cy.get('#signupBtn').click()
    })
it('should have an email with the right format', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#fullname').type('John Doe')
        cy.get('#email').type('johndoe')
        cy.get('#signupBtn').click()
    })
    it('should have a password with at least 8 characters', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#fullname').type('John Doe')
        cy.get('#email').type('johndoe@gmail.com')
        cy.get('#password').type('1234567')
        cy.get('#signupBtn').click()
    })
    it('should have matching passwords', () => { 
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#fullname').type('John Doe')
        cy.get('#email').type('johndoe@gmail.com')
        cy.get('#password').type('Test1234.')
        cy.get('#re-enterpassword').type('Testing1234')
        cy.get('#signupBtn').click()
    })
    it('should register user succesfully if all inputs are correct', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#fullname').type('John Doe')
        cy.get('#email').type('johndoe@gmail.com')  
        cy.get('#password').type('Test1234.')
        cy.get('#re-enterpassword').type('Test1234.')
        cy.get('#signupBtn').click()

    })
})

describe('All links are functioning', () => {
    it('should redirect to login page', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('a[href="../Auth/login.html"]').click()
    })
     it('should redirect to homepage', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('a[href="../index.html"]').click()
    })  
})

describe('Should redirect you to loginpage if all inputs are appropriate', () => {
    it('should redirect to login page', () => {
        cy.visit('http://127.0.0.1:5500/client/Auth/signup.html')
        cy.get('#fullname').type('John Doe')
        cy.get('#email').type('john@gmail.com')
        cy.get('#password').type('Test1234.')
        cy.get('#re-enterpassword').type('Test1234.')
        cy.get('#signupBtn').click()
    })
})
