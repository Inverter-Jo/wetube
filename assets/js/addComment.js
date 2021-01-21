import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteBtns = document.querySelectorAll(".deleteBtn");

let commentId;

const deleteComment = async (event) => {
    event.preventDefault();
    const deleteBtnEvent = event.target;
    commentId = deleteBtnEvent.nextElementSibling.innerHTML;
    const videoid = window.location.href.split("/videos/")[1];
    const response = await axios({
        url:`/api/${videoid}/delete_comment`,
        method:"POST",
        data: {
            commentId
        }
    });
    if(response.status === 200){
        console.log(commentId);
    };
}

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}

const addComment = (comment) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerHTML = comment;
    li.appendChild(span);
    commentList.prepend(li);
    increaseNumber(commentNumber);
};

const sendComment = async (comment) => {
    const videoid = window.location.href.split("/videos/")[1];
    const response = await axios({
        url:`/api/${videoid}/comment`,
        method:"POST",
        data: {
            comment
        }
    });
    if(response.status === 200){
        addComment(comment);
    };
};

const handleSubmit = (event) => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value="";
};

function init() {
    addCommentForm.addEventListener("submit", handleSubmit);
    deleteBtns.forEach((deleteBtn) =>
    deleteBtn.addEventListener("click", deleteComment)
  );
};

if(addCommentForm){
    init();
};