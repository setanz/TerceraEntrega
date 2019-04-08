const fs = require("fs")
listaCursos = []
listaMatriculas = []
listaEstudiantes = []

const crearCurso = (curso) => 
{
    listarCursos()
    let duplicado = listaCursos.find(cursosGuardados => cursosGuardados.ID == curso.ID)
    if (!duplicado)
    {
        listaCursos.push(curso)
        guardarCurso()
    }
    else
    {
        console.log("Ya existe otro curso con ese nombre")
    }
}

const cerrarCurso = (ID) =>
{
    listarCursos()
}

const listarCursos = () =>
{
    try
    {
        listaCursos = require("./cursos.json")
    }
    catch(error)
    {
        listaCursos = []
    }

}

const guardarCurso = () =>
{
    let datos = JSON.stringify(listaCursos)
    fs.writeFile("src/cursos.json", datos,(err) =>
    {
        if (err) throw (err)
    } )
}

//

const crearEstudiante = (estudiante) => 
{
    listarEstudiantes()
    let duplicado = listaEstudiantes.find(estudiantesGuardados => estudiantesGuardados.CC == estudiante.CC)
    if (!duplicado)
    {
        listaEstudiantes.push(estudiante)
        guardarEstudiantes()
        return true
    }
    else
    {
        console.log("Ya existe otro estudiante con ese nombre")
        return false
    }
}

const listarEstudiantes = () =>
{
    try
    {
        listaEstudiantes = require("./estudiantes.json")
    }
    catch(error)
    {
        listaEstudiantes = []
    }

}

const guardarEstudiantes = () =>
{
    let datos = JSON.stringify(listaEstudiantes)
    fs.writeFile("src/estudiantes.json", datos,(err) =>
    {
        if (err) throw (err)
        console.log("Archivo creado con exito")
    } )
}


const crearMatricula = (matricula) => 
{
    listarMatriculas()
    let duplicado = listaMatriculas.find(matriculasGuardadas => matriculasGuardadas.CC == matricula.CC && matriculasGuardadas.ID == matricula.ID)
    if (!duplicado)
    {
        listaMatriculas.push(matricula)
        console.log(listaMatriculas)
        guardarMatriculas()
    }
    else
    {
        console.log("Ya existe otra matricula con esos registros")
    }
}

const listarMatriculas = () =>
{
    try
    {
        listaMatriculas = require("./matriculas.json")
    }
    catch(error)
    {
        listaMatriculas = []
    }

}

const guardarMatriculas = () =>
{
    let datos = JSON.stringify(listaMatriculas)
    fs.writeFile("src/matriculas.json", datos,(err) =>
    {
        if (err) throw (err)
        console.log("Archivo creado con exito")
    } )
}

module.exports = 
{
    crearCurso,
    listaCursos,
    listarCursos,
    listaEstudiantes,
    crearEstudiante,
    listarEstudiantes,
    listaMatriculas,
    crearMatricula,
    listarMatriculas,
    guardarCurso,
    guardarMatriculas
}

console.log(listarCursos(), listaCursos)