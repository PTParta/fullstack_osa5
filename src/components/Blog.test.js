import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'titteli',
    author: 'Mr. X',
    url: 'www.testi.com',
    likes: 0
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'titteli'
  )
  expect(component.container).toHaveTextContent(
    'Mr. X'
  )
  expect(component.container).not.toHaveTextContent(
    'www.testi.com'
  )
  expect(component.container).not.toHaveTextContent(
    0
  )
})