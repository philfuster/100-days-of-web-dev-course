const loadCommentsBtnElement = document.getElementById('load-comments-btn');
const commentsElement = document.getElementById('comments');
const commentsFormElement = document.querySelector('#comments-form form');
const commentTitleElement = document.getElementById('title');
const commentTextElement = document.getElementById('text');

function createCommentList(comments) {
  const commentListElement = document.createElement('ol');

  comments.forEach(comment => {
    const commentElement = document.createElement('li');
    commentElement.innerHTML = `
      <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
      </article>
    `;
    commentListElement.appendChild(commentElement);
  })
  return commentListElement;
}

async function fetchCommentsForPost(event) {
  const postId = loadCommentsBtnElement.dataset.postid;
  try {
    const response = await fetch(`/posts/${postId}/comments`);
    if (!response.ok) {
      alert('Fetching comments failed!');
      return;
    }
    const responseData = await response.json();
    if (responseData != null && responseData.length > 0) {
      commentsElement.innerHTML = '';
      commentsElement.appendChild(createCommentList(responseData));
    } else {
      commentsElement.firstElementChild.textContent = 'No comments found';
    }
  } catch (error) {
    alert('Error Fetching comments!')
  }
}

async function saveComment(event) {
  event.preventDefault();
  const postId = commentsFormElement.dataset.postid;
  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;

  const comment = {
    title: enteredTitle,
    text: enteredText,
  }

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(response);
    if (response.ok) {
      fetchCommentsForPost();
      commentTitleElement.value = '';
      commentTextElement.value = '';
    } else {
      alert('could not send comment!');
    }
  } catch(error) {
    alert('Could not send request - maybe try again later!');
  }
}

loadCommentsBtnElement.addEventListener('click', fetchCommentsForPost);
commentsFormElement.addEventListener('submit', saveComment);