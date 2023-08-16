'use client'
import styles from './page.module.css'
import Spline from './Spline'
import {Overlay} from './Overlay'

export default function Home() {
  return (
    <main className={styles.scene}>
      <Spline></Spline>
      <Overlay></Overlay>
    </main>
  )
}
