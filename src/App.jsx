import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import './App.css'

function App() {
  const [accepted, setAccepted] = useState(false)
  const noButtonRef = useRef(null)
  const containerRef = useRef(null)
  const heartsRef = useRef(null)
  const titleRef = useRef(null)
  const yesButtonRef = useRef(null)

  useEffect(() => {
    if (accepted) return // Don't run animations when showing celebration
    
    // Initial animations
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { y: -100, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
      )
    }
    
    if (yesButtonRef.current) {
      gsap.fromTo(yesButtonRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, delay: 0.5, ease: "back.out(1.7)" }
      )
    }
    
    if (noButtonRef.current) {
      gsap.fromTo(noButtonRef.current,
        { scale: 0, rotation: 180 },
        { scale: 1, rotation: 0, duration: 0.8, delay: 0.7, ease: "back.out(1.7)" }
      )
    }

    // Floating hearts background (only once)
    if (heartsRef.current && heartsRef.current.children.length === 0) {
      createFloatingHearts()
    }
  }, [accepted])

  const createFloatingHearts = () => {
    const hearts = heartsRef.current
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('div')
      heart.innerHTML = '💕'
      heart.className = 'floating-heart'
      heart.style.left = `${Math.random() * 100}%`
      heart.style.animationDelay = `${Math.random() * 5}s`
      heart.style.fontSize = `${Math.random() * 20 + 15}px`
      hearts.appendChild(heart)
    }
  }

  const handleNoHover = () => {
    const button = noButtonRef.current
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    
    // Calculate random position within container bounds
    const maxX = containerRect.width - button.offsetWidth - 50
    const maxY = containerRect.height - button.offsetHeight - 50
    
    const newX = Math.random() * maxX
    const newY = Math.random() * maxY
    
    gsap.to(button, {
      x: newX - containerRect.width / 2 + button.offsetWidth,
      y: newY - containerRect.height / 2 + button.offsetHeight,
      duration: 0.3,
      ease: "power2.out"
    })

    // Add a little shake to tease
    gsap.to(button, {
      rotation: Math.random() * 30 - 15,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    })
  }

  const handleYesClick = () => {
    setAccepted(true)
  }

  const handleReset = () => {
    setAccepted(false)
    
    // Reset No button position after state change
    setTimeout(() => {
      if (noButtonRef.current) {
        gsap.set(noButtonRef.current, { x: 0, y: 0, rotation: 0 })
      }
    }, 100)
  }

  const handleYesHover = () => {
    gsap.to(yesButtonRef.current, {
      scale: 1.1,
      duration: 0.2,
      ease: "power2.out"
    })
  }

  const handleYesLeave = () => {
    gsap.to(yesButtonRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    })
  }

  return (
    <div className="app" ref={containerRef}>
      <div className="hearts-container" ref={heartsRef}></div>
      
      {!accepted ? (
        <div className="question-container">
          <h1 ref={titleRef} className="title">
            Will You Be My Valentine? 💝
          </h1>
          
          <div className="buttons-container">
            <button 
              ref={yesButtonRef}
              className="btn yes-btn"
              onClick={handleYesClick}
              onMouseEnter={handleYesHover}
              onMouseLeave={handleYesLeave}
            >
              Yes! 💖
            </button>
            
            <button 
              ref={noButtonRef}
              className="btn no-btn"
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
            >
              No 😢
            </button>
          </div>
          
        </div>
      ) : (
        <div className="celebration-container">
          <h1 className="celebration-title">Yay! 🎉💕</h1>
          <div className="gif-container">
            <img 
              src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmtlZ3poYnNmc3lndnNtZjA0d3R5ZzJhdHk1aWR4M3VybGE2Y2EyMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FbiL9rsmZN3ib2JSGo/giphy.gif" 
              alt="Happy celebration"
              className="celebration-gif"
            />
          </div>
          <p className="love-message">I knew you'd say yes! 💘</p>
          <button className="btn reset-btn" onClick={handleReset}>
            Ask Again 🔄
          </button>
          <div className="hearts-rain"></div>
        </div>
      )}
    </div>
  )
}

export default App
