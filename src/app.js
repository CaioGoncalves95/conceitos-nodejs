const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params; // pego o ID vindo como parâmetro da requisição
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repositories => repositories.id === id); // procuro no array de repositorios o id que estou procurando

  if (repoIndex < 0) { // se não achar
    return response.send(400).json({ error: 'Repository not found' })
  }

  const repo = repositories[repoIndex];

  repo.title = title;
  repo.url = url;
  repo.techs = techs;

  repositories[repoIndex] = repo;

  return response.json(repo);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repositories => repositories.id === id); // procuro no array de repositorios o id que estou procurando

  if (repoIndex < 0) { // se não achar
    return response.send(400).json({ error: 'Repository not found' })
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const foundRepo = repositories.find(repository => repository.id === id); // procura o repositório que tem o id vindo como parâmetro na req

  if (!foundRepo) { // se não existir
    return response.send(400).json({ error: 'Repository not found' })
  }

  foundRepo.likes += 1;

  return response.json(foundRepo);
});

module.exports = app;
