import { parse, v4 as uuidv4 } from 'uuid'

import styles from './Project.module.css'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import Message from '../layout/Message'


import ServiceForm from '../services/ServiceForm'
import ServiceCard from '../services/ServiceCard'

import ProjectForm from '../project/ProjectForm'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';

export default function Project() {

    const { id } = useParams()
    
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()


    //? resgatando projeto do banco de dados
    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setProject(data)
            setServices(data.services)
        })
        .catch(error => console.log(error))
        }, 1000)
    }, [id])


    //* função para criar um serviço
    function createService(project) {
        setMessage('')

        //? last service
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        //? maximum value validation
        if(newCost > parseFloat(project.budget)) {
            setMessage('Serviço maior que o valor do orçamento. Verifique o valor do serviço.')
            setType('error')
            project.services.pop()
            return false
        }

        //? add service cost to project total cost
        project.cost = newCost

        //? update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then(response => response.json())
        .then(data => {
            //? exibir serviços
            setShowServiceForm(false)
        })

    }

    //* função para remover os serviços
    function removeService(id, cost) {
        setMessage('')
        
        const servicesUpdate = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
        .then(resp => resp.json())
        .then(() => {
            setProject(projectUpdated)
            setServices(servicesUpdate)
            setType('success')
            setMessage('Serviço removido com sucesso!')
        })
        .catch(err => console.log(err))
    }

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }
    
    //* editar um post
    function editPost(project) {
        setMessage('')
        //? budget validation
        if(project.budget < project.cost) {
            //? message
            setMessage('O orçamento deve ser maior que o custo')
            //? type
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH', //? altera apenas o que foi mudado
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then(response => response.json())
        .then(data => {
            setProject(data)
            setShowProjectForm(false)
            //? message
            setMessage('Projeto atualizado!')
            //? type
            setType('success')
        })
        .catch(err => console.log(err))

    }

    return (
        <div>
            {project && (
                project.name ? (
                    <div className={styles.project_detais}>
                        <Container customClass="column">
                            {message &&  
                                <Message type={type} message={message}/>
                            }
                            <div className={styles.detail_container}>
                                <h1>Projeto: {project.name}</h1>
                                <button className={styles.btn} onClick={toggleProjectForm}>
                                    {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                                </button>
                                {!showProjectForm ? (
                                    <div className={styles.project_info}>
                                        <p>
                                            <span>Categoria: </span> {project?.category?.name}
                                        </p>
                                        <p>
                                            <span>Total de Orçamento: </span> R${project.budget}
                                        </p>
                                        <p>
                                            <span>Total Utilizado: </span> R${project.cost}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={styles.project_info}>
                                        <ProjectForm 
                                            handleSubmit={editPost} 
                                            btnText="Concluir Edição"
                                            projectData={project}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={styles.service_form_container}>
                                <h2>Adicione um serviço:</h2>
                                <button className={styles.btn} onClick={toggleServiceForm}>
                                    {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                                </button>
                                <div className={styles.project_info}>
                                    {showServiceForm && (
                                        <ServiceForm
                                            handleSubmit={createService}
                                            btnText="Adicionar serviço"
                                            projectData={project}
                                        />
                                    )}
                                </div>
                            </div>

                            <h2>
                                Serviços
                            </h2>
                            {/* mostra os serviços */}
                            <Container customClass="start">
                                {services.length > 0 &&
                                    services.map(service => (
                                        <ServiceCard 
                                            id={service.id}
                                            name={service.name}
                                            cost={service.cost}
                                            description={service.description}
                                            key={service.id}
                                            handleRemove={removeService}
                                        />
                                    ))
                                }

                                {services.length === 0 && 
                                    <p>Não há serviços cadastrados</p>
                                }
                            </Container>
                        </Container>
                    </div>
                ) : (
                    <Loading />
                )
            )}
        </div>
    )
}