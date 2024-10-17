# Apresentação Docker

# Docker

## Instalação do Docker

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

Após essa configuração, é necessário reiniciar o servidor, para que a aplicação do grupo seja efetuada no usuário logado

## Criação de uma imagem
Para criarmos um container, primeiro precisamos de uma imagem. Essa imagem, será utilizada para definir todas as bibliotecas e dependências que o nosso container deve possuir. Para isso, executamos o comando abaixo:
```sh
docker build -t imagem-container-back:lastest -f Dockerfile-back .
docker build -t imagem-container-front:lastest -f Dockerfile-front .
```

Após finalizada a compilação, podemos verificar a criação das imagens, executando o comando abaixo:
```sh
docker images
```

## Criação do container
Após a criação da imagem, é necessário realizar o deploy do nosso container. Ele nada mais é do que a execução em tempo real da imagem que foi compilada anteriormente, e com o código da nossa aplicação sendo executada. As dependências que a nossa aplicação necessitar, estará centralizada dentro desse container, tirando a responsabilidade da máquina host de possuir essas dependências.

Para criar um container, é necessário executar o comando abaixo:
```sh
docker run --name container_back_apresentacao -d -p 80:80 imagem-container-back:lastest
docker run --name container_front_apresentacao -d -p 80:80 imagem-container-front:lastest
```

Existem várias opções de comandos que podem ser utilizados juntamente com o comando `docker run`, mas vamos passar somente nesses que utilizamos:
* **--name:** Define um nome para o container sendo executado;
* **-d:** Define que o container será executado em segundo plano, fazendo com que o terminal seja liberado para uso;
* **-p:** Define as portas de entrada para acesso da aplicação. O primeiro, define a porta de entrada da máquina host, e o segundo, a porta de entrada no container;

## Finalização de execução
Depois de utilizado, basta você executar o comando abaixo, para parar a execução do container:
```sh
docker stop container_front_apresentacao
docker stop container_back_apresentacao
```

# Orquestração de containeres

## Instalação do kubectl e minkube

Utilizando os comandos abaixo, podemos realizar a instalação do kubectl, que é uma ferramenta de linha de comando que vai permitir com que nós consigamos interagir com os clusters kubernetes.
```sh
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

Depois de instalado do kubectl, precisamos realizar a instalação de uma ferramenta que vai nos permitir executar o kubernetes de forma local. Para isso, vamos executar os comandos abaixo.
```sh
curl -LO https://github.com/kubernetes/minikube/releases/download/v1.34.0/minikube-linux-amd64

chmod +x minikube-linux-amd64 && sudo mv minikube-linux-amd64 /usr/local/bin/minikube
```

Depois de instalado, precisamos iniciar o minikube com o comando abaixo, para realizar a instação do cluster único que o minikube nos fornece.
```sh
minikube start
```

Para visualizar se a instalação do cluster foi finalizada com sucesso, executaremos o comando abaixo. Esse comando, nos mostrará todos os nós criados pelo minikube. Nesse caso, todos os serviços que devem ser executados pelo kubernetes, será executado dentro desse nó.
```sh
kubectl get nodes
```

## Configuração do escalonamento

Depois de ter instalado o minikube e o kubectl, precisamos realizar a configuração de escalonamento dos nossos containeres dentro. Para isso, precisamos enviar as imagens que geramos a alguns passos antes, para dentro do minikube. Isso se deve ao fato, do ambiente do minikube estar isolado da máquina hospedeira. Ele permitirá com que utilizemos o docker dentro do minikube e então podemos realizar o build da imagem novamente.

Para isso, executamos o comando abaixo:
```sh
eval $(minikube docker-env)
```

Depois precisamos criar os deployments referentes as imagens das nossas aplicações de teste. Esses deployments, são objetos que referenciam uma aplicação que está em execução no cluster. Para isso, precisamos executar os comandos abaixo:
```sh
kubectl apply -f projeto-back/api-deployment.yaml
kubectl apply -f projeto-front/app-deployment.yaml
```

Após isso, vamos criar os services, que vão fazer com que a nossa aplicação funcione. Então, executamos os comandos abaixo:
```sh
kubectl apply -f projeto-back/api-service.yaml
kubectl apply -f projeto-front/app-service.yaml
```

Depois de configurado, podemos verificar se os nossos pods foram criados e estão ativos. Então, executamos o comando abaixo:
```sh
kubectl get pods
```

Estando tudo configurado e sendo executado, vamos precisar expor as nossas aplicações para consumo externo, portanto, precisamos executar o comando abaixo. Isso fará com que consigamos acessar as aplicações pelo navegador.
```sh
minikube tunnel
```

Veremos que, quando executarmos o teste de carga, ocorrerá problemas de rede. Isso acontece, porque o acesso ao pod, não está liberado para acesso remoto, ou seja, acessos feitos fora do contexto do kubernetes. Para ajustar isso, precisamos 'liberar' o acesso ao pod da nosssa API, para tal, podemos executar o comando abaixo:
```sh
kubectl port-forward service/api-service 8000:80
```

Com isso, estamos dizendo que todas as requisições que forem feitas para a porta 8000 da máquina host, serão redirecionadas para a porta 80 do pod da API.

Feito isso, agora os ajaxs que estavam sendo feitos pela aplicação frontend, vão começar a dar sucesso. Mas se formos aumentando a quantidade de requisições, vamos 