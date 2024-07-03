const submitBtn = document.getElementById('submit-button')
submitBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const rating = document.getElementById('rating').value;

    let ratingObj = {
        name: name,
        rating: rating
    }
    postData(ratingObj);

    updateRatingCount(rating, 1);

    if (submitBtn.textContent === "UPDATE") {
        submitBtn.textContent = "SUBMIT";    
    }

    const form = document.getElementById('feedbackForm');
    form.reset();
});

function postData(ratingObj) {
    axios.post("https://crudcrud.com/api/10fb9d05be3d43edb7998803ee90d1bf/userData", ratingObj)
        .then((result) => {
            console.log(result);
            let newRatingObj = {
                id: result.data._id,
                name: result.data.name,
                rating: result.data.rating
            };
            userId = newRatingObj.id;
            localStorage.setItem(userId, JSON.stringify(newRatingObj));
            displayUserRating(newRatingObj);
        }).catch((err) => {
            console.log(err);
        });
}

function displayUserRating(newRatingObj) {
    const parentElm = document.getElementById('displayFeedbackList');
    const childElm = document.createElement('li');
    const btnContainer = document.createElement('span');

    const editBtn = document.createElement('button');
    editBtn.textContent = "EDIT";
    editBtn.addEventListener('click', function (event) {
        editUser(event);
    })

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "DELETE";
    deleteBtn.addEventListener('click', function (event) {
        deleteUser(event);
    })

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    childElm.textContent = `Name:- ${newRatingObj.name}, Rating:- ${newRatingObj.rating} `;
    childElm.setAttribute('id', newRatingObj.id)
    childElm.appendChild(btnContainer);
    parentElm.appendChild(childElm);
}

function deleteUser(event) {
    const targetItem = event.target.parentNode.parentNode;
    userId = targetItem.id;
    const storedUser = JSON.parse(localStorage.getItem(userId));
    updateRatingCount(storedUser.rating, -1);
    localStorage.removeItem(userId);
    removeFromScreen(targetItem);
    deleteData(userId);
}

function deleteData(userId) {
    axios.delete(`https://crudcrud.com/api/10fb9d05be3d43edb7998803ee90d1bf/userData/${userId}`)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        });
}

function editUser(event) {
    const targetItem = event.target.parentNode.parentNode;
    const userId = targetItem.id;
    const storedUser = JSON.parse(localStorage.getItem(userId));

    document.getElementById('name').value = storedUser.name;
    document.getElementById('rating').value = storedUser.rating;

    const submit = document.getElementById('submit-button');
    submit.textContent = "UPDATE";
    updateRatingCount(storedUser.rating, -1);
    deleteData(userId);
    removeFromScreen(targetItem);
}

function removeFromScreen(targetItem) {
    const parentElement = targetItem.parentNode;
    parentElement.removeChild(targetItem);
}

function updateRatingCount(rating, increment) {
    const ratingSpan = document.getElementById(`rating${rating}`);
    ratingSpan.textContent = parseInt(ratingSpan.textContent) + increment;
}

document.addEventListener('DOMContentLoaded', () => {
    axios.get("https://crudcrud.com/api/10fb9d05be3d43edb7998803ee90d1bf/userData")
        .then((response) => {
            const users = response.data;
            const parentElm = document.getElementById('displayFeedbackList');
            users.forEach((user) => {
                const newRatingObj = {
                    id: user._id,
                    name: user.name,
                    rating: user.rating
                };
                displayUserRating(newRatingObj);
                localStorage.setItem(newRatingObj.id, JSON.stringify(newRatingObj));
                updateRatingCount(newRatingObj.rating, 1);
            });
        })
        .catch((err) => {
            console.log(err);
        });
});
