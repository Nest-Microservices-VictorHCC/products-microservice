<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Product Microservice

## Description

Este microservicio forma parte de un sistema basado en arquitectura de microservicios desarrollado con NestJS y comunicación mediante mensajes usando `@nestjs/microservices`.

Su propósito principal es gestionar productos, incluyendo operaciones como crear, listar, actualizar y eliminar productos. Este servicio no expone endpoints HTTP directamente, sino que responde a mensajes entrantes con comandos específicos.

## DEV setup

1. Clonar el repositorio
2. Instalar dependencias
```bash
$ npm install
```
3. Crear un archivo `.env` basado en `.env.template`
4. Ejecutar migración de prisma 
```bash
$ npx prisma migrate dev
```
5. Ejecutar
```bash
$ npm run start:dev
```



