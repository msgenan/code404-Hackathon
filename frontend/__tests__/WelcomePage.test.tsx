import { render, screen } from '@testing-library/react'
import WelcomePage from '@/components/WelcomePage'

describe('WelcomePage Component', () => {
  it('renders the welcome page heading', () => {
    render(<WelcomePage />)
    
    const heading = screen.getByText(/Healthcare appointments made simple/i)
    
    expect(heading).toBeInTheDocument()
  })

  it('renders feature items', () => {
    render(<WelcomePage />)
    
    const fastAppointments = screen.getByText(/Fast Appointments/i)
    const smartQueue = screen.getByText(/Smart Queue/i)
    const liveSupport = screen.getByText(/Live Support/i)
    
    expect(fastAppointments).toBeInTheDocument()
    expect(smartQueue).toBeInTheDocument()
    expect(liveSupport).toBeInTheDocument()
  })

  it('renders auth buttons', () => {
    render(<WelcomePage />)
    
    const loginButton = screen.getByText(/Login/i)
    const registerButton = screen.getByText(/Register/i)
    
    expect(loginButton).toBeInTheDocument()
    expect(registerButton).toBeInTheDocument()
  })
})
