import { Link } from "react-router-dom"
import Container from "./Container"

import styles from './Navbar.module.css'
import logo from '../../img/costs_logo.png'

function Navbar() {
    /* 
        <li>
            <Link to="/newproject" className={styles.li}>Novo Projeto</Link>
        </li> 
    */
    return (
        <nav className={styles.navbar}>
            <Container>
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <ul className={styles.list}>
                    <li>
                        <Link to="/" className={styles.li}>Home</Link>
                    </li>
                    <li>
                        <Link to="/projects" className={styles.li}>Projetos</Link>
                    </li>
                    <li>
                        <Link to="/company" className={styles.li}>Sobre nós</Link>
                    </li >
                    <li>
                        <Link to="/contact" className={styles.li}>Contato</Link>
                    </li>
                </ul>
            </Container>
        </nav>
    )
}

export default Navbar