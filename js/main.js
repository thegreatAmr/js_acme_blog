const BASE_API_URL = "https://jsonplaceholder.typicode.com/";

// 1
function createElemWithText(element = "p", textContent = "", className) {
  const elem = document.createElement(element);
  elem.textContent = textContent;
  if (className) elem.setAttribute("class", className);
  return elem;
}

// 2
function createSelectOptions(users) {
  if (!users) return undefined;
  const options = [];
  users.forEach((user) => {
    const option = document.createElement("option");
    option.setAttribute("value", user.id);
    option.textContent = user.name;
    options.push(option);
  });
  return options;
}

// 3
function toggleCommentSection(postId) {
  if (!postId) return undefined;
  const element = document.querySelector(`section[data-post-id="${postId}"]`);
  if (element) element.classList.toggle("hide");
  return element;
}

// 4
function toggleCommentButton(postId) {
  if (!postId) return undefined;
  const element = document.querySelector(`button[data-post-id="${postId}"]`);
  if (element) {
    element.textContent = element.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
  }
  return element;
}

// 5
function deleteChildElements(parentElement) {
  if (!parentElement?.tagName) return undefined;

  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}

// 6
const addButtonListeners = () => {
  const buttons = document.querySelectorAll('main button');
  for (let i = 0; i < buttons.length; i++) {
    const postId = buttons[i].dataset.postId;
    buttons[i].addEventListener('click', (event) => {
      toggleComments(event, postId);
    }, true);
  }
  return buttons;
};



// 7
function removeButtonListeners() {
  const buttons = document.querySelector("main").querySelectorAll("button");
  buttons.forEach((button) => {
    button.removeEventListener("click", (e) => {
      toggleComments(e, button.dataset.postId);
    }, false);
  });
  return buttons;
}

// 8
function createComments(comments) {
  if (!comments) return undefined;

  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const article = document.createElement("article");
    article.append(createElemWithText("h3", comment.name));
    article.append(createElemWithText("p", comment.body));
    article.append(createElemWithText("p", `From: ${comment.email}`));
    fragment.append(article);
  });
  return fragment;
}

// 9
function populateSelectMenu(users) {
  if (!users) return undefined;
  const menu = document.getElementById("selectMenu");
  const options = createSelectOptions(users);
  options.forEach((option) => menu.append(option));
  return menu;
}

// 10
async function getUsers() {
  const url = BASE_API_URL + "users";
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

// 11
async function getUserPosts(userId) {
  if (!userId) return undefined;
  const url = BASE_API_URL + `users/${userId}/posts`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

// 12
async function getUser(userId) {
  if (!userId) return undefined;
  const url = BASE_API_URL + `users/${userId}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

// 13
async function getPostComments(postId) {
  if (!postId) return undefined;
  const url = BASE_API_URL + `posts/${postId}/comments`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

// 14
async function displayComments(postId) {
  if (!postId) return undefined;
  const section = document.createElement('section');
  section.dataset.postId = postId;
  section.classList.add('comments', 'hide');
  const comments = await getPostComments(postId);
  const fragment = await createComments(comments);
  section.append(fragment);
  return section;
}

// 15
async function createPosts(posts) {
  if (!posts) return undefined;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const article = document.createElement("article");
    article.append(createElemWithText("h2", post.title));
    article.append(createElemWithText("p", post.body));
    article.append(createElemWithText("p", `Post ID: ${post.id}`));
    const author = await getUser(post.userId);
    article.append(createElemWithText("p", `Author: ${author.name} with ${author.company.name}`));
    article.append(createElemWithText("p", author.company.catchPhrase));
    const button = createElemWithText("button", "Show Comments");
    button.dataset.postId = post.id;
    article.append(button);
    const section = await displayComments(post.id);
    article.append(section);
    fragment.append(article);
  }
  return fragment;
}

// 16
async function displayPosts(posts) {
  const main = document.querySelector('main');
  let element;
  if (posts) {
    element = await createPosts(posts);
  } else {
    element = createElemWithText('p', "Select an Employee to display their posts.");
    element.classList.add('default-text');
  }
  main.append(element);
  return element;
}

// 17
function toggleComments(event, postId) {
  if (!event || !postId) return undefined;
  const result = [];
  event.target.listener = true;
  result.push(toggleCommentSection(postId));
  result.push(toggleCommentButton(postId));
  return result;
}

// 18
async function refreshPosts(posts) {
  if (!posts) return undefined;
  const result = [];
  const main = document.querySelector('main');
  result.push(removeButtonListeners());
  result.push(deleteChildElements(main));
  result.push(await displayPosts(posts));
  result.push(addButtonListeners());
  return result;
}

// 19
const selectMenuChangeEventHandler = async (event) => {
  if (!event) {
    return undefined;
  }
  const userId = event?.target?.value || 1;
  const postJsonData = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(postJsonData);
  return [userId, postJsonData, refreshPostsArray];
};


// 20
async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
}

// 21
async function initApp() {
  await initPage();
  const menu = document.getElementById('selectMenu');
  menu.addEventListener('change', selectMenuChangeEventHandler);
}

document.addEventListener('DOMContentLoaded', initApp);
