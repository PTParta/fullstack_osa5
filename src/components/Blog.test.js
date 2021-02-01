import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'



describe('renders contents of a blog', () => {

  let component

  beforeEach(() => {

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
    component = render(
      <Blog blog={blog} user={user} />
    )

  })

  test('renders only title and author', () => {

    const div = component.container.querySelector('.blogTitleAndAuthor')
    expect(div).toHaveTextContent('titteli')
    expect(div).toHaveTextContent('Mr. X')
    expect(div).not.toHaveTextContent('www.testi.com')
    expect(div).not.toHaveTextContent('likes')

    //component.debug()
  })

  test('renders the whole blog', () => {

    const div = component.container.querySelector('.blogWhole')
    expect(div).toHaveTextContent('titteli')
    expect(div).toHaveTextContent('Mr. X')
    expect(div).toHaveTextContent('www.testi.com')
    expect(div).toHaveTextContent('likes')

    //component.debug()
  })
})

describe('like button tests', () => {

  let component
  let mockHandler

  beforeEach(() => {

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

    mockHandler = jest.fn()

    component = render(
      <Blog blog={blog} user={user} likeBlog={mockHandler} />
    )


  })

  test('clicking the "like" button twice causes two calls to the event handler function that is passed as a prop', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})


