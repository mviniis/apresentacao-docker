# Apresentação Docker

# Instalação do Docker

é necessário ter um linux instalado(WSL ou a máquina)

atualização dos pacotes disponíveis do sitema
```sh
  sudo apt update
```

instalação dos pacotes necessários para que alguns pacotes utilizem o HTTPS
```sh
  sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

depois disso é necessário adicionar a chave GPG do repositório oficial do Docker
```sh
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  sudo apt update
```

é necessário também definir que a instalação será feita a partir depositório Docker, ao invés de um repositório padrão do Ubuntu
```sh
  apt-cache policy docker-ce
```

por fim, pode-se realizar a instalação do Docker
```sh
  sudo apt install docker-ce
```

para executar o docker sem o sudo, basta realizar a configuração abaixo:
```sh
  sudo usermod -aG docker ${USER}
```

# Instalação do kubectl e minkube

realize o dowload e instalação do binário do kubectl
```sh
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

depois realizamos o download e a instalação d minikube
```sh
  curl -LO https://github.com/kubernetes/minikube/releases/download/v1.34.0/minikube-linux-amd64

  chmod +x minikube-linux-amd64 && sudo mv minikube-linux-amd64 /usr/local/bin/minikube
```

# Criação de uma imagem
Para criarmos um container, primeiro precisamos de uma imagem. Essa imagem, será utilizada para definir todas as bibliotecas e dependências que o nosso container deve possuir. Para isso, executamos o comando abaixo:
```sh
  docker build -t imagem-container-{tipo}:lasted -f Dockerfile-{tipo} .
```

Após finalizada a compilação, podemos verificar a criação da imagem, executando o comando abaixo:
```sh
  docker images | grep imagem-container
```

# Criação do container
Após a criação da imagem, é necessário realizar o deploy do nosso container. Ele nada mais é do que a execução em tempo real da imagem que foi compilada anteriormente, e com o código da noss aplicação sendo executada. As dependências que a nossa aplicação necessitar, estará centralizada dentro desse container, tirando a responsabilidade da máquina host de possuir essas dependências.

Para criar um container, é necessário executar o comando abaixo:
```sh
  docker run --name container_{tipo}_apresentacao -d -p 80:80 imagem-container-{tipo}:lasted
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
