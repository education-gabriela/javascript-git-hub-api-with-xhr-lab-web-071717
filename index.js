const repositoriesDiv = document.getElementById("repositories");
const detailsDiv = document.getElementById("details");
const branchesDiv = document.getElementById("branches");
const usernameInput = document.getElementById("username");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("github-form");

  form.addEventListener("submit", function (event) {
    getRepositories(usernameInput.value);
    event.preventDefault();
  });

  repositoriesDiv.addEventListener("click", function (event) {
    const repository = event.target.dataset.repository;
    if (!repository) {
      return;
    }
    getCommits(repository);
    getBranches(usernameInput.value, repository);
  });
});

function getRepositories (username) {
  const url = `https://api.github.com/users/${username}/repos`;
  const request = new XMLHttpRequest();
  request.addEventListener("load", showRepositories);
  request.open("GET", url);
  request.send();
}

function showRepositories () {
  repositoriesDiv.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const repositories = JSON.parse(this.responseText);

  const h1 = document.createElement("h1");
  h1.innerText = usernameInput.value;
  fragment.appendChild(h1);

  const ul = document.createElement("ul");

  repositories.forEach(repository => {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.href = "#";
    a.innerText = repository["name"];
    a.dataset.repository = repository["name"];

    li.appendChild(a);
    ul.appendChild(li);
  });
  fragment.appendChild(ul);
  repositoriesDiv.appendChild(fragment);
}

function getCommits (repositoryName) {
  const request = new XMLHttpRequest();
  const owner = repositoriesDiv.querySelector("h1").innerText;
  const url = `https://api.github.com/repos/${owner}/${repositoryName}/commits`;

  request.addEventListener ("load", function () {
    displayCommits.call(this, owner, repositoryName);
  });

  request.open("GET", url);
  request.send();
}

function displayCommits (owner, repositoryName) {
  detailsDiv.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const commits = JSON.parse(this.responseText);
  const h1 = document.createElement("h1");
  h1.innerText = repositoryName;
  fragment.appendChild(h1);

  const ul = document.createElement("ul");

  commits.forEach(commit => {
    const li = document.createElement("li");
    li.innerText = `${commit.author.login} - ${commit.sha}`;
    ul.appendChild(li);
  });

  fragment.appendChild(ul);
  detailsDiv.appendChild(fragment);
}

function getBranches (owner, repositoryName) {
  const request = new XMLHttpRequest();
  const url = `https://api.github.com/repos/${owner}/${repositoryName}/branches`;
  request.addEventListener("load", displayBranches);
  request.open("GET", url);
  request.send();
}

function displayBranches () {
  branchesDiv.innerHTML = "";

  const branches = JSON.parse(this.responseText);
  const fragment = document.createDocumentFragment();

  const ul = document.createElement("ul");

  branches.forEach(branch => {
    const li = document.createElement("li");
    li.innerText = branch["name"];
    ul.appendChild(li);
  });
  fragment.appendChild(ul);
  branchesDiv.appendChild(fragment);
}
