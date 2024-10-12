# Apresentação Docker

# Criação de uma imagem
Para criarmos um container, primeiro precisamos de uma imagem. Essa imagem, será utilizada para definir todas as bibliotecas e dependências que o nosso container deve possuir. Para isso, executamos o comando abaixo:
```sh
  docker build -t apresentacao:lasted .
```

Após finalizada a compilação, podemos verificar a criação da imagem, executando o comando abaixo:
```sh
  docker images | grep apresentacao
```

# Criação do container
Após a criação da imagem, é necessário realizar o deploy do nosso container. Ele nada mais é do que a execução em tempo real da imagem que foi compilada anteriormente, e com o código da noss aplicação sendo executada. As dependências que a nossa aplicação necessitar, estará centralizada dentro desse container, tirando a responsabilidade da máquina host de possuir essas dependências.

Para criar um container, é necessário executar o comando abaixo:
```sh
  docker run --name container_apresentacao -d -p 80:80 apresentacao:lasted
```

Existem várias opções de comandos que podem ser utilizados juntamente com o comando `docker run`, mas vamos passar somente nesses que utilizamos:
* **--name:** Define um nome para o container sendo executado;
* **-d:** Define que o container será executado em segundo plano, fazendo com que o terminal seja liberado para uso;
* **-p:** Define as portas de entrada para acesso da aplicação. O primeiro, define a porta de entrada da máquina host, e o segundo, a porta de entrada no container;

# Finalização de execução
Depois de utilizado, basta você executar o comando abaixo, para parar a execução do container:
```sh
  docker stop container_apresentacao
```
