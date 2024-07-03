let totalBookings = 0;

const addBtn = document.getElementById('submit-button')
addBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const seat = document.getElementById('seat-number').value;

    let movieObj = {
        name: name,
        seat: seat
    }

    const isSeatOccupied = await checkSeatOccupied(seat);
    if (isSeatOccupied) {
        alert("This Seat is Occupied !");
    } else{
        postData(movieObj);
    }   

    if (addBtn.textContent === "UPDATE") {
        addBtn.textContent = "ADD";    
    }

    const form = document.getElementById('feedbackForm');
    form.reset();
});

async function checkSeatOccupied(seat) {
    return axios.get("https://crudcrud.com/api/854f671e2a0f426cb334ddc43ce0945b/userData")
        .then(response => {
            const users = response.data;
            for (let i = 0; i < users.length; i++) {
                if (users[i].seat === seat) {
                    return true;
                }
            }
            return false;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}

function postData(movieObj) {
    axios.post("https://crudcrud.com/api/854f671e2a0f426cb334ddc43ce0945b/userData", movieObj)
        .then((result) => {
            console.log(result);
            let newMovieObj = {
                id: result.data._id,
                name: result.data.name,
                seat: result.data.seat
            };
            let userId = newMovieObj.id;
            localStorage.setItem(userId, JSON.stringify(newMovieObj));
            displayUserSeat(newMovieObj);
            totalBookings++;
            document.getElementById('total-booking').textContent = totalBookings;
        }).catch((err) => {
            console.log(err);
        });
}

function displayUserSeat(newMovieObj) {
    const parentElm = document.getElementById('display-user');
    
    if (parentElm.querySelector('h1')) {
        parentElm.innerHTML = '';
    }

    const childElm = document.createElement('h4');
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

    childElm.textContent = `Name: ${newMovieObj.name}, Seat: ${newMovieObj.seat} `;
    childElm.setAttribute('id', newMovieObj.id)
    childElm.appendChild(btnContainer);
    parentElm.appendChild(childElm);

    document.getElementById('total-booking').textContent = totalBookings;
}

function deleteUser(event) {
    const targetItem = event.target.parentNode.parentNode;
    const userId = targetItem.id;
    const storedUser = JSON.parse(localStorage.getItem(userId));

    localStorage.removeItem(userId);
    removeFromScreen(targetItem);
    deleteData(userId);
    totalBookings--; 
    document.getElementById('total-booking').textContent = totalBookings;
}

function deleteData(userId) {
    axios.delete(`https://crudcrud.com/api/854f671e2a0f426cb334ddc43ce0945b/userData/${userId}`)
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
    document.getElementById('seat-number').value = storedUser.seat;

    const submit = document.getElementById('submit-button');
    submit.textContent = "UPDATE";

    totalBookings--;
    deleteData(userId);
    removeFromScreen(targetItem);
}

function removeFromScreen(element) {
    element.remove();
}


document.addEventListener('DOMContentLoaded', () => {
    axios.get("https://crudcrud.com/api/854f671e2a0f426cb334ddc43ce0945b/userData")
        .then(response => {
            const users = response.data;
            users.forEach(user => {
                localStorage.setItem(user._id, JSON.stringify(user));
                displayUserSeat({
                    id: user._id,
                    name: user.name,
                    seat: user.seat
                });
                totalBookings++;
                document.getElementById('total-booking').textContent = totalBookings;
            });
        })
        .catch(err => {
            console.log(err);
        });
});

const findSlotInput = document.getElementById('find-slot');
findSlotInput.addEventListener('keyup', function (event) {
    const seatNumber = event.target.value.trim();
    filterUserBySeat(seatNumber);
});

function filterUserBySeat(seatNumber) {
    const displayUsers = document.querySelectorAll('#display-user h4');
    let noUserFound = document.getElementById('no-user-found');

    if (seatNumber === '') {
        displayUsers.forEach(user => {
            user.style.display = 'flex';
        });
        if (noUserFound) {
            noUserFound.remove();
        }
    } else {
        let found = false;

        displayUsers.forEach(user => {
            const userText = user.textContent;
            if (userText.includes(`Seat: ${seatNumber}`)) {
                user.style.display = 'flex';
                found = true;
            } else {
                user.style.display = 'none';
            }
        });

        if (!found) {
            if (!noUserFound) {
                noUserFound = document.createElement('h2');
                noUserFound.id = 'no-user-found';
                noUserFound.textContent = 'No User Found';
                document.getElementById('display-user').appendChild(noUserFound);
            } else {
                noUserFound.style.display = 'block';
            }
        } else {
            if (noUserFound) {
                noUserFound.style.display = 'none';
            }
        }
    }
}