# aws-workshop

Base for a workshop on building systems with nodejs and terraform

This workshop was featured at:

- https://skillsmatter.com/conferences/11213-fullstack-london-2019-the-conference-on-javascript-node-and-internet-of-things#program

## Initial setup:

```shell
cd ui && yarn && cd .. && yarn
```

## To run the project UI:

```shell
yarn start:ui
```

## To run the server inside a docker container (with watch enabled):

```shell
yarn docker:build
yarn docker:start
```

## To run the server:

```shell
yarn start:server
```

## To build the lambdas:

```shell
yarn build:lambdas
```
