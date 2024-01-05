import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Message from "../layout/Message"
import Container from '../layout/Container'
import Loading from '../layout/Loading'
import LinkButton from '../layout/LinkButton'

import ProjectCard from '../project/ProjectCard'

import styles from './Projects.module.css'

export default function Projects() {

    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')

    const location = useLocation()
    let msg = ''
    if(location.state) {
        msg = location.state.message
    }

    useEffect(() => {
        setTimeout(() => {
            fetch('http://localhost:5000/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setProjects(data);
                setRemoveLoading(true)
            })
            .catch(error => console.log(error))
        }, 700)
    }, [])

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json()
        .then(() => {
            setProjects(projects.filter((project) => project.id !== id))
            setProjectMessage('Projeto removido com sucesso!')
        }))
    }

    return (
        <div className={styles.projects_container}>
            <div className={styles.title_container}>
                <h1>Projects</h1>
                <LinkButton to='/newproject' text="Criar Projeto"/>
            </div>

            {/* exibe mensagem de criação de projeto */}
            {msg && <Message type="success" message={msg}/>}

            {/* exibe mensagem de exclusão de projeto */}
            {projectMessage && <Message type="success" message={projectMessage}/>}

            <Container customClass="start">
                {projects.length > 0 &&
                    projects.map((project) => (
                        <ProjectCard 
                            id={project.id}
                            category={project?.category?.name}
                            name={project.name} 
                            budget={project.budget}
                            key={project.id}
                            handleRemove={removeProject}
                        />
                ))}

                {/* adiciona o loading */}
                {!removeLoading && <Loading />}

                {removeLoading && projects.length === 0 && (
                    <p>Não há projetos cadastrados</p>
                )}

            </Container>
        </div>
    )
}