const baseUrl = "https://crudcrud.com/api/e02c1251426a49129facab1a1297656c";

const voteBtn = document.getElementById('submit-button');
voteBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const userName = document.getElementById('name').value;
    const userVote = document.getElementById('candidate').value;

    let voteObj = {
        name: userName,
        vote: userVote
    };

    postData(voteObj);

    const form = document.getElementById('votingForm');
    form.reset();
});


function postData(obj) {
    axios.post(`${baseUrl}/votingData`, obj)
        .then((result) => {
            console.log(result);
            let newObj = {
                id: result.data._id,
                name: obj.name,
                vote: obj.vote
            };
            let userId = newObj.id;
            localStorage.setItem(userId, JSON.stringify(newObj));
            displayUserVote(newObj);
            updateVoteCounts(newObj.vote);
        }).catch((err) => {
            console.log(err);
        });
}

function displayUserVote(obj) {
    const listName = `display${obj.vote}List`;
    const listUserName = obj.name;

    const parentElm = document.getElementById(listName);

    const displayUserVoteName = document.createElement('span');
    displayUserVoteName.textContent = listUserName;

    const childElm = document.createElement('div');
    const btnContainer = document.createElement('span');

    childElm.id = obj.id;

    const deleteVoteBtn = document.createElement('button');
    deleteVoteBtn.textContent = "DELETE";
    deleteVoteBtn.addEventListener('click', function (event) {
        deleteUserVote(event);
    });

    btnContainer.appendChild(displayUserVoteName);
    btnContainer.appendChild(deleteVoteBtn);

    childElm.appendChild(btnContainer);
    parentElm.appendChild(childElm);
}

function deleteUserVote(event) {
    const targetItem = event.target.parentNode.parentNode;
    const userId = targetItem.id;
    const votingData = JSON.parse(localStorage.getItem(userId));

    localStorage.removeItem(userId);

    axios.delete(`${baseUrl}/votingData/${userId}`)
        .then((result) => console.log(result))
        .catch((err) => console.log(err));

    updateVoteCounts(votingData.vote, false);

    const listItem = targetItem;
    const parentElm = listItem.parentElement;
    parentElm.removeChild(listItem);
}

function updateVoteCounts(candidate, increment = true) {
    const totalVotes = document.getElementById('totalVotes');
    totalVotes.textContent = parseInt(totalVotes.textContent) + (increment ? 1 : -1);

    const candidateVotes = document.getElementById(`vote${candidate}`);
    candidateVotes.textContent = parseInt(candidateVotes.textContent) + (increment ? 1 : -1);
}

document.addEventListener('DOMContentLoaded', () => {
    axios.get(`${baseUrl}/votingData`)
        .then(response => {
            const items = response.data;
            items.forEach(item => {
                localStorage.setItem(item._id, JSON.stringify(item));
                displayUserVote(item);
                updateVoteCounts(item.vote); 
            });
        })
        .catch(err => {
            console.log(err);
        });
});
