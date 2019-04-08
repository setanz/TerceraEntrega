require('./config/config');
const express = require('express')
const app = express ()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
//### Para usar las variables de sesión
const session = require('express-session')
var MemoryStore = require('memorystore')(session)

const Aspirante = require('./modelos/aspirante.js')
const Curso = require('./modelos/curso.js')
const Matricula = require('./modelos/matricula.js')
const bcrypt = require('bcrypt');

const hbs = require("hbs")
const fs = require("fs")
const funciones = require("./funciones")
const helpers = require("./helpers")

const directorioPublico = path.join(__dirname, "../public")
const directorioPartials = path.join(__dirname, "../partials")
app.use(express.static(directorioPublico))
hbs.registerPartials(directorioPartials)
app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'hbs')


//### Para usar las variables de sesión
app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'keyboard cat',
  	resave: true,
  	saveUninitialized: true
}))

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado) => {
	if (err){
		return console.log(error)
	}
	console.log("conectado")
});
// SESSION
app.use((req, res, next) =>{

	if(req.session.usuario){		
		res.locals.sesion = true
        res.locals.nombre = req.session.nombre
        res.locals.coordinador = req.session.coordinador
        res.locals.aspirante = req.session.aspirante
        res.locals.invitado = false
	}else{
        res.locals.invitado = true
    }	
	next()
})

app.get('/', function (req, res)
{    
    res.render('main')
})

//CREAR CURSO   
app.get('/crear', function (req, res)
{
    res.render('crear')
})

app.post('/creacionCurso', (req,res) => 
{
    Curso.findOne({id : req.body.ID}, (err, resultados) => {
		if (err){
            return console.log(err)
            		
		}
		if(resultados == null){
            let curso = new Curso ({
                nombre : req.body.nombre,
                id : req.body.ID,
                modalidad : req.body.modalidad,
                descripcion : req.body.descripcion,
                valor : req.body.valor,
                intensidad : req.body.valor,
                estado : "disponible"
                
            })
         
            curso.save((err, resultado) => {
                if (err){
                    console.log("error")
                    return res.render ('crear', {
                        mostrar : err
                    })			
                }	
                console.log("creado")	
                res.render ('crear', {			
                        
                        mostrar : "Curso creado de manera exitosa"
                    })		
            })
        }if(resultados != null){
            res.render ('crear', {			
                        
                mostrar: "Ya existe un curso con ese ID"
                
            })		
        }
	})
})

//VER CURSOs
app.get('/verCursos', function (req, res)
{
    Curso.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('verCursos',{
			listado : respuesta
		})
	})
})

//INSCRIBIR

// con session podemos simplemente pedir el curso donde se quiere registrar"mirar actualizar"
app.get('/inscribir', (req, res) =>
{
    Aspirante.findById(req.session.usuario, (err, usuario) =>{
        if (err){
            return console.log(err)
        }

        if (!usuario){
            res.render('mensaje',{
                mensaje: "Para continuar debes de registrarte"
            })
        }
        Curso.find({},(err,respuesta)=>{
            if (err){
                return console.log(err)
            }
    
            res.render ('inscribir',{
                nombre : usuario.nombre,
                telefono : usuario.telefono,
                correo : usuario.correo,
                documento : usuario.documento,
                listado: respuesta
            })
            
        })
    });
})

app.post('/inscribir', function (req,res)
{
    
    Matricula.findOne({cursoId : req.body.cursoId, documento: req.body.documento  }, (err, resultados) => {
		if (err){
            return console.log(err)
            		
		}
		if(resultados == null){
            let matricula = new Matricula ({
                documento : req.body.documento,
                cursoId : req.body.cursoId
                
            })
         
            matricula.save((err, resultado) => {
                if (err){
                    console.log("error")
                    return res.render ('mensaje', {
                        mensaje : err
                    })			
                }	
                res.render ('mensaje', {			
                        
                        mensaje : "Inscripción exitosa"
                    })		
            })
        }if(resultados != null){
            res.render ('mensaje', {			
                        
                mensaje: "Ya estas inscrito en este curso"
                
            })		

        }
	})
   
})
// VER INSCRITOS
app.get('/verInscritos', function (req, res)
{
    Matricula.find({},(err,matricula)=>{
        if (err){
            return console.log(err)
        }
        Aspirante.find({},(err,aspirante)=>{
            if (err){
                return console.log(err)
            }
            Curso.find({},(err,curso)=>{
                if (err){
                    return console.log(err)
                }
                res.render('verInscritos',{
                    matriculas: matricula,
                    aspirantes: aspirante,
                    cursos: curso
                })
            })
        })
        
        
    })
})

// VER CURSO
app.get('/verCurso/:id', function(req, res){
    let id = req.params.id
    Curso.find({id},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}
		res.render ('verCurso',{
			listado : respuesta
		})
	})
    

 })
 // CERRAR CURSO
 app.get('/cerrarCurso/:id', function (req,res)
 {
     Curso.findOneAndUpdate({id: req.params.id}, req.body, {new : true, runValidators: true, context: 'query' }, (err, resultados) => {
     
		if (err){
			return console.log(err)
		}

		if(!resultados){
            res.render('main')

        }
        
        resultados.estado = "cerrado"
        resultados.save()
		res.render ('main')
    })
    
 })

 //ELIMINAR MATRICULA
 app.post('/eliminarMatricula/', function(req,res)
{
    Matricula.findOneAndDelete({documento : req.body.documento, cursoId: req.body.cursoId}, req.body, (err, resultados) => {
		if (err){
			return console.log(err)
		}

		if(!resultados){
			res.redirect ('/verInscritos')

		}

		res.redirect ('/verInscritos')
    })
})

//REGISTRAR ASPIRANTE
app.get('/registrar', function (req, res)
{
    res.render('registrar')
})

app.post('/registrar', function (req,res)
{
    Aspirante.findOne({documento : req.body.documento}, (err, resultados) => {
		if (err){
            return console.log(err)
            		
		}
		if(resultados == null){
            let aspirante = new Aspirante ({
                nombre : req.body.nombre,
                telefono : req.body.telefono,
                correo : req.body.correo,
                documento : req.body.documento,
                tipo : "aspirante"
                
            })
         
            aspirante.save((err, resultado) => {
                if (err){
                    console.log("error")
                    return res.render ('registrar', {
                        mostrar : err
                    })			
                }	
                console.log("registrado")	
                res.render ('registrar', {			
                        
                        mostrar : "Se ha registrado de manera exitosa"
                    })		
            })
        }if(resultados != null){
            res.render ('registrar', {			
                        
                mostrar: "El usuario ya se encuentra registrado"
                
            })		
        }
	})	

    
})

// INGRESAR
app.post('/ingresar', (req, res) => {	
    
   
	Aspirante.findOne({documento : req.body.documento}, (err, resultados) => {
		if (err){
			return console.log(err)
		}
		if(!resultados){
            res.render('main',{
                mensaje: "Usuario no existe o datos invalidos"
            })
        }	
        if(resultados.nombre != req.body.nombre){
            res.render('main',{
                mensaje: "Usuario no existe o datos invalidos"
            })
        }
        //Para crear las variables de sesión
        if(resultados.tipo == "aspirante"){
            req.session.aspirante = true

        }
        if(resultados.tipo == "coordinador"){
            req.session.coordinador = true

        }
        req.session.usuario = resultados._id
        req.session.nombre = resultados.nombre
        res.render('main', {
                    mensaje : req.session.nombre,
                    aspirante: req.session.aspirante,
                    coordinador: req.session.coordinador,
                    invitado: false,
                    sesion : true					
        })

    })	
    
})

app.get('/salir', (req, res) => {
	req.session.destroy((err) => {
  		if (err) return console.log(err) 	
	})	
	res.redirect('/')	
})

app.listen(process.env.PORT, () => {
	console.log ('Escuchando en el puerto ' + process.env.PORT)
});

