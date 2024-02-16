
import { Container } from '@mui/material'
import './App.css'
import MainContent from './component/MainContent'

function App() {


  return (
    <>
      <div className='page'>
        <Container maxWidth="xl">
          <MainContent/>
        </Container>
      </div>
    </>
  )
}

export default App
