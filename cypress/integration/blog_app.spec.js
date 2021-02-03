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

      cy.login({ username: 'pablo', password: 'salainen' })
    })

    it('a new blog can be created', function () {
      cy.contains('new note').click()

      cy.get('#title').type('React tips and tricks')
      cy.get('#author').type('React Guru')
      cy.get('#url').type('www.react.com')
      cy.get('#createblog').click()

      cy.contains('a new blog React tips and tricks by React Guru added')
      cy.contains('React tips and tricks')
      cy.contains('React Guru')
      cy.get('#blogShortView').contains('React tips and tricks')
      cy.get('#blogShortView').contains('React Guru')
    })

    it('a blog can be liked', function () {

      cy.createBlog({
        title: 'title 0',
        author: 'author 0',
        url: 'www.url0.com',
        likes: 0
      })

      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
      cy.contains('like').click()
      cy.contains('likes 2')
    })

    it('a blog can be deleted by the person who created it', function () {

      cy.createBlog({
        title: 'title 0',
        author: 'author 0',
        url: 'www.url0.com',
        likes: 0
      })

      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('#blogShortView').should('not.contain', 'React tips and tricks')
      cy.get('#blogShortView').should('not.contain', 'React Guru')
    })

    it('blogs are sorted by the amount of likes in descending order', function () {
      cy.createBlog({
        title: 'title 1',
        author: 'author 1',
        url: 'www.url1.com',
        likes: 1
      })
      cy.createBlog({
        title: 'title 2',
        author: 'author 2',
        url: 'www.url2.com',
        likes: 2
      })
      cy.createBlog({
        title: 'title 3',
        author: 'author 3',
        url: 'www.url3.com',
        likes: 3
      })
      cy.createBlog({
        title: 'title 4',
        author: 'author 4',
        url: 'www.url4.com',
        likes: 4
      })
      cy.get('.blogWhole').then(blogs => {
        /* console.log('---------------------------')
        console.log(blogs[0].innerText)
        console.log('---------------------------') */
        expect(blogs[0].innerText).contains('likes 4')
        expect(blogs[1].innerText).contains('likes 3')
        expect(blogs[2].innerText).contains('likes 2')
        expect(blogs[3].innerText).contains('likes 1')

      })
    })
  })

})
