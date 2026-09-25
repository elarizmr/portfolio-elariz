import Header from './components/Header'
import MorphingLogo from './components/MorphingLogo'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import ChatBotSection from './components/ChatBotSection'
import Contact from './components/Contact'
import Footer from './components/Footer'


export default function Home() {
  return (
    <>
      <Header />
      <MorphingLogo />
      <main>
      <Hero />
      <Portfolio />
      <ChatBotSection />
      <Contact />
      </main>
      <Footer />
    
    </>
  )
}