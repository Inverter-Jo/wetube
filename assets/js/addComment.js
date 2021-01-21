import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteBtns = document.querySelectorAll(".deleteBtn");

let delId;

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const delButton = document.createElement("button")
    span.innerHTML = comment;
    delButton.innerHTML = "❌";
    li.appendChild(span);
    li.appendChild(delButton);
    commentList.prepend(li);
    increaseNumber(commentNumber);
};

const deleteComment = async (event) => {
    event.preventDefault();
    const deleteBtnEvent = event.target;
    delId = deleteBtnEvent.nextSibling.innerHTML;
    const parent = deleteBtnEvent.parentNode;
    parent.parentNode.removeChild(parent);
    decreaseNumber(commentNumber);
    const videoid = window.location.href.split("/videos/")[1];
    const response = await axios({
        url:`/api/${videoid}/delete_comment`,
        method:"POST",
        data: {
            delId
        }
    });
    if(response.status === 200){
        console.log(delId);
    };
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