import { useEffect, useState } from 'react'

import styles from './ProjectForm.module.css'

//* componentização do formulário (pode ser gerado dinamicamente)
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'

export default function ProjectForm( {handleSubmit, btnText, projectData} ) {

    // async function fetchCategories() {
    //     const results = await fetch('http://localhost:5000/categories')

    //     console.log(results.json())
    // }

    // fetchCategories()

    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})

    //? faz a consulta no banco de dados do projeto via fetch
    useEffect(() => {
        fetch('http://localhost:5000/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then( (resp) => resp.json() )
        .then( (data) => {
            setCategories(data)
        })
        .catch( (erro) => console.log(erro) )
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    function handleChange(e) {
        setProject({ ...project, [e.target.name] : e.target.value })
    }

    function handleCategory(e) {
        setProject({ ...project, 
                    category: {
                        id: e.target.value,
                        name: e.target.options[e.target.selectedIndex].text,
                    }, 
        })
        //console.log(project);
    } 

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input 
                type="text" 
                text="Nome do projeto"
                name="name"
                placeholder="Insira o nome do projeto"
                handleOnChange={handleChange}
                //value={project.name ? project.name : ''}
            />
            <Input 
                type="number" 
                text="Orçamento do projeto"
                name="budget"
                placeholder="Insira o orçamento do projeto"
                handleOnChange={handleChange}
                //value={project.budget ? project.budget : ''}
            />
        
            <Select 
                name="category_id" 
                text="Selecione a categoria"
                options={categories}
                handleOnChange={handleCategory}
                value={project.category ? project.category.id : ''}
            />
            
            <SubmitButton text={btnText}/>

        </form>
    )
}
