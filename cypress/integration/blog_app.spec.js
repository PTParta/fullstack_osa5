describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'pauli',
      username: 'pablo',
      password: 'salainen'
    }

    cy.request('POST', 'http://localhost:3001/api/users/', user)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login').click()
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('pablo')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('pauli logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('pablo')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('pablo')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('new note').click()

      cy.get('#title').type('React tips and tricks')
      cy.get('#author').type('React Guru')
      cy.get('#url').type('www.react.com')
      cy.get('#createblog').click()

      cy.contains('new note').click()

      cy.get('#title').type('Javascript is fun')
      cy.get('#author').type('Javascript Guru')
      cy.get('#url').type('www.js.com')
      cy.get('#createblog').click()
    })

    it('a new blog can be created', function () {
      cy.contains('a new blog React tips and tricks by React Guru added')
      cy.contains('React tips and tricks')
      cy.contains('React Guru')
      cy.get('#blogShortView').contains('React tips and tricks')
      cy.get('#blogShortView').contains('React Guru')
    })

    it('a blog can be liked', function () {
      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
      cy.contains('like').click()
      cy.contains('likes 2')
    })
    
    it.only('a blog can be deleted by the person who created it', function () {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('#blogShortView').should('not.contain', 'React tips and tricks')
      cy.get('#blogShortView').should('not.contain', 'React Guru')
    })
  })
})