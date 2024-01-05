import LinkButton from '../layout/LinkButton'

import styles from './Home.module.css'
import savings from '../../img/savings.svg'

function Home() {
    return (
        <section className={styles.home_container}>
            <h1>Bem-vindo ao seu <span>Gerenciador de Projetos</span></h1>
            <p>Gerencie seus projetos de maneira rápida e intuitiva!</p>
            <LinkButton to='/newproject' text="Criar Projeto"/>
            <img src={savings} alt="savings" />
        </section>
    )
}

export default Home