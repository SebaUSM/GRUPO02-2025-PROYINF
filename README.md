## Semestre 2025-1
Este es el repositorio del grupo 2 cuyos integrantes son:

* Sebastián Torres - 202073596-4
* Aylin Sandoval - 
* Nicolás Gonzalez - 201990004-8
* Bruno Yáñez - 

#### Ayudante: Carlos Arevalo
#### Profesor: Ricardo Salas


## Semestre Pasado 2024-2

## INF236-GRUPO-11

Este es el repositorio del grupo 11 cuyos integrantes son:

* Sebastián Torres - 202073596-4
* Macarena del Hoyo - 202104653-4
* Bastian Ulloa - 202130532-7
* Felipe Azargado - 202273089-7

#### Ayudante: Tabata Ahumada
#### Profesor: Ricardo Salas

## Wiki

* [Link de Wiki](https://github.com/SebaUSM/hito-1/wiki)

## Videos

* [Video presentación cliente](https://www.youtube.com/watch?v=abJau21SDIk)
* [Prototipo del proyecto](https://drive.google.com/file/d/1IWqYfkCJeXBLzhFBOsCx3eZIERb5-Bum/view?usp=sharing)

## Fases para levantar el proyecto
* Descargar el proyecto y descomprimir el ```.zip``` resultante en un directorio exclusivo.
* Instalar [PostgreSQL](https://www.postgresql.org/) (Es la base de datos a utilizar). Se debe crear una base de datos nueva con el nombre ```"fia_app_bd"```, y deberá cambiar las credenciales del archivo ```.env```
<details>
<summary> Cómo editar archivo .env? </summary>
Dentro de un IDE que permita su edición (ej. VSC) deberá ver la siguiente estructura:

```
DB_HOST=127.0.0.1
DB_NAME=fia_app_bd
DB_USER=postgres
DB_PASSWORD="password"
JWT_SECRET=tu_jwt_secret
PORT=3000
```
Donde tendrá que cambiar el segmento ```"password"``` por la contraseña que haya sido declarada al momento de instalar PostgreSQL
</details>

* Instalar node.js. Se puede descargar desde [Nodejs.org](https://nodejs.org/en) (Se instalará npm que corresponde al gestor de paquetes de Node.js)
-------------
IMPORTANTE: De aquí en adelante deberá ingresar los siguientes comandos (vía cmd, bash, PowerShell, etc) ubicándose en el directorio raíz del proyecto
* Ejecute el siguiente comando para instalar todas las dependencias listadas en package.json:
```
npm install
```
* Asegurándose de que Postgre esté en ejecución (con la base de datos ```"fia_app_bd"``` activa), ocupar el comando:
```
npx knex migrate:latest
```
Esto creará la tabla de usuarios en la base de datos, luego ocupe el siguiente comando:
```
npx knex seed:run
```
Este comando rellenará la tabla con valores de prueba para iniciar sesión en la web posteriormente
* Finalmente para ejecutar el proyecto, se debe ingresar el siguiente comando:
```
node public/js/app.js
```
* Para ingresar al sitio web deberá abrir sus navegador de preferencia e ir a la direccion ```http://localhost:3000``` donde verá el proyecto levantado.

