import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const addBlog = jest.fn()

  const user = {
    name: 'Kalle',
    username: 'villekalle'
  }

  const blog = {
    title: 'titteli',
    author: 'Mr. X',
    url: 'www.testi.com',
    likes: 0,
    user: user
  }

  const dummySetErrorMessageFunction = () => {
    return
  }

  const component = render(
    <BlogForm blog={blog} user={user} createBlog={addBlog} setErrorMessage={dummySetErrorMessageFunction}/>
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'testi title' }
  })
  fireEvent.change(author, {
    target: { value: 'testi author' }
  })
  fireEvent.change(url, {
    target: { value: 'testiurl.com' }
  })
  fireEvent.submit(form)
  
  //console.log(addBlog.mock.calls[0][0])

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('testi title')
  expect(addBlog.mock.calls[0][0].author).toBe('testi author')
  expect(addBlog.mock.calls[0][0].url).toBe('testiurl.com')
})