const user = {
  username: "",
  userdata: null,
  repos: [],
};
document.onload = setUser(localStorage.getItem("user-name"));

// console.log(user);
const inputElement = document.querySelector("input");
inputElement.addEventListener("change", async (e) => {
  user.username = e.target.value;

  user.userdata = await getUserData(user.username);
  user.repos = await getRepos(user.userdata.repos_url);
  localStorage.setItem("user-name", user.username);
  setValues();
});
const viewBtn = document.querySelector("#view-btn");
viewBtn.addEventListener("click", () => {
  window.location.href = user.userdata.html_url;
});
async function getUserData(username) {
  try {
    const response = await fetch("https://api.github.com/users/" + username);
    const jsonResponse = await response.json();
    // console.log(jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.log(error);
  } finally {
    //console.log("Fetched " + username);
  }
}

async function getRepos(reposUrl) {
  try {
    const response = await fetch(reposUrl);
    const jsonResponse = await response.json();
    // console.log(jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.log(error);
  } finally {
    //console.log("Fetched " + username);
  }
}
async function setUser(username) {
  if (username !== null) {
    user.username = username;
    user.userdata = await getUserData(username);
    user.repos = await getRepos(user.userdata.repos_url);
    setValues();
  }
}

function setValues() {
  setInput();
  setImg();
  setStats();
  setDetails();
  setRepos();
}
function setInput() {
  const inputElement = document.querySelector("input");
  inputElement.value = user.username;
}
function setImg() {
  const imgElement = document.querySelector("img");
  imgElement.src = user.userdata.avatar_url;
}
function setStats() {
  const statElements = document.querySelectorAll(
    ".user-details-container > .stats-container > .stat > span"
  );
  statElements[0].textContent = user.userdata.public_repos;
  statElements[1].textContent = user.userdata.public_gists;
  statElements[2].textContent = user.userdata.followers;
  statElements[3].textContent = user.userdata.following;
}
function setDetails() {
  const detailElements = document.querySelectorAll(
    ".user-details-container > .details-container > .detail > span"
  );
  detailElements[0].textContent = getValue(user.userdata.company);
  detailElements[1].textContent = getValue(user.userdata.blog);
  detailElements[2].textContent = getValue(user.userdata.location);
  detailElements[3].textContent = getValue(user.userdata.created_at);
}
function setRepos() {
  const reposElements = document.querySelectorAll(".repos-name");
  const starElements = document.querySelectorAll(".stars");
  const watcherElements = document.querySelectorAll(".watchers");
  const forkElements = document.querySelectorAll(".forks");
  sortLatestRepos();
  for (let i = 0; i < 5; i++) {
    reposElements[i].textContent = user.repos[i].name;
    reposElements[i].href = user.repos[i].html_url;
    starElements[i].textContent = user.repos[i].stargazers_count;
    watcherElements[i].textContent = user.repos[i].watchers_count;
    forkElements[i].textContent = user.repos[i].forks_count;
  }
}

function getValue(value) {
  if (value === null || value === "") {
    return `${"\u00a0"}null`;
  } else {
    return `${"\u00a0"}${value}`;
  }
}
function sortLatestRepos() {
  user.repos.sort(function (a, b) {
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  });
  //   console.log(user.repos);
}
