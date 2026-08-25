import './App.css'
import { PhaserGame } from './game/PhaserGame'

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <span className="app__eyebrow">React + Vite + Phaser 4</span>
        <h1>Primeira cena Phaser</h1>
        <p>Clique dentro do jogo para mover o personagem.</p>
      </header>

      <PhaserGame />
    </main>
  )
}

export default App
