import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', {
      name: /to get started, edit the page\.tsx file/i,
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders the Next.js logo', () => {
    render(<Home />)
    
    const logo = screen.getByAltText('Next.js logo')
    
    expect(logo).toBeInTheDocument()
  })

  it('contains links to templates and learning center', () => {
    render(<Home />)
    
    const templatesLink = screen.getByRole('link', { name: /templates/i })
    const learningLink = screen.getByRole('link', { name: /learning/i })
    
    expect(templatesLink).toBeInTheDocument()
    expect(learningLink).toBeInTheDocument()
    expect(templatesLink).toHaveAttribute('href', expect.stringContaining('vercel.com/templates'))
    expect(learningLink).toHaveAttribute('href', expect.stringContaining('nextjs.org/learn'))
  })

  it('renders the deploy button', () => {
    render(<Home />)
    
    const deployLink = screen.getByRole('link', { name: /vercel logomark/i })
    
    expect(deployLink).toBeInTheDocument()
    expect(deployLink).toHaveAttribute('href', expect.stringContaining('vercel.com/new'))
  })
})
