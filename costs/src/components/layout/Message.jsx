import { useState, useEffect } from 'react'

import styles from './Message.module.css'

export default function Message( {type, message} ) {

  const [visible, setVisible] = useState(false)

  //? verifica se há alguma mensagem para tornar o status como visível
  useEffect(() => {
    if(!message) {
      setVisible(false)
      return
    } else {
      setVisible(true)
  
      const timer = setTimeout(() => {
        setVisible(false)
      }, 2500)
  
      return () => clearTimeout(timer)
    }

  }, [message])
  //? fim da verificação

  return (
    <> 
      {visible && (
        <div className={`${styles.message} ${styles[type]}`}>
          {message}
        </div>
      )}
    </>
  )
}