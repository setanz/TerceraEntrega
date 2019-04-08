const hbs = require("hbs")

hbs.registerHelper('ListarCursos', (listado) =>
{
    let texto = ""
    listado.forEach(curso => {
        if (curso.estado == "disponible")
        {

            texto = texto + 
                    "<tr>" +
                    `<td> <a href = "verCurso/${curso.id}">` + curso.nombre + "</a></td>" +
                    "<td>" + curso.descripcion + "</td>" +
                    "<td>" + curso.valor + "</td>" +
                    
                    "</tr>"
        }
        
    })
    return texto
})
hbs.registerHelper('ListarCursosAdmin', (listado) =>
{
    let texto = ""
    listado.forEach(curso => {
        
        if (curso.estado == "disponible")
        {
        
            texto = texto + 
                    "<tr>" +
                    `<td> <a href = "verCurso/${curso.id}">` + curso.nombre + "</a></td>" +
                    "<td>" + curso.descripcion + "</td>" +
                    "<td>" + curso.valor + "</td>" +
                    `<td><form class="form-inline" action = "/cerrarCurso/${curso.id}">
                        <button class="btn btn-outline-warning" type="submit">Cerrar</button>
                    </form></td>`
                    "</tr>"
                }else{
                    texto = texto + 
                    "<tr>" +
                    `<td> <a href = "verCurso/${curso.id}">` + curso.nombre + "</a></td>" +
                    "<td>" + curso.descripcion + "</td>" +
                    "<td>" + curso.valor + "</td>" +
                    
                    "</tr>"
                    
                }
    })
    return texto
})


hbs.registerHelper('NombresCursos', (listado) =>
{
    let texto = ""
    listado.forEach(curso => {
        if (curso.estado == "disponible")
        {
            texto += `<option value ="${curso.id}"> ${curso.nombre} </option>`
        }
    })
    return texto
})

hbs.registerHelper('MostrarInteresados', (matriculas, aspirantes, cursos) =>
{
    texto =""

    cursos.forEach( curso =>
        {
            if (curso.estado == "disponible")
            {
                texto += `<table class="table"> 
                    <tr>
                            <th colspan="5" style="text-align:center">${curso.nombre}</th>
                    </tr>`
                texto += `<tr>
                        <td>Documento</td>
                        <td>Nombre</td>
                        <td>Correo</td>
                        <td>Telefono</td>
                        <td>Eliminar</td>
                    </tr>`
                let estudiantesMatriculados = matriculas.filter(matricula =>
                    matricula.cursoId == curso.id
                )
                estudiantesMatriculados.forEach( est =>
                    {
                        estudiante = aspirantes.filter(iterador => est.documento == iterador.documento)
                        estudiante = estudiante[0]

                        texto += `<tr>
                        <td>${estudiante.documento}</td>
                        <td>${estudiante.nombre}</td>
                        <td>${estudiante.correo}</td>
                        <td>${estudiante.telefono}</td>
                        <td><form class="form-inline" action = "/eliminarMatricula" method="POST">
                            <input type="hidden" name="documento" value="${estudiante.documento}">
                            <input type="hidden" name="cursoId" value="${curso.id}">
                            <button class="btn btn-outline-warning" type="submit">Eliminar</button>
                        </form></td>
                        </tr>`
                    })
                texto += `</table>`
            }
            
        })

    return texto
    
})

hbs.registerHelper('verCurso', (listado) =>
{
    texto = `<table class = "table">`+ "<tr>" + "<th>Etiqueta</th>" + " <th>Valor</th>" + "</tr>"
    curso = listado[0]
    texto += "<tr>" +
            "<td>" + "Nombre" + "</td>" +
            "<td>" + curso.nombre + "</td>" 
    texto += "</tr>" +
    "<tr>" +
    "<td>" + "Modalidad" + "</td>" +
    "<td>" + curso.modalidad + "</td>" +
    "</tr>"
    texto += "<tr>" +
    "<td>" + "Valor" + "</td>" +
    "<td>" + curso.valor + "</td>" +
    "</tr>"
    texto += "<td>" + "Descripcion" + "</td>" +
    "<td>" + curso.descripcion + "</td>" +
    "</tr>" 
    texto +=  "<td>" + "Intensidad" + "</td>" +
    "<td>" + curso.intensidad + "</td>" +
    "</tr>"
    texto += "<tr>" +
    "<td>" + "Estado" + "</td>" +
    "<td>" + curso.estado + "</td>" +
    "</tr>" 
    texto += "</table>"
    return texto
})
