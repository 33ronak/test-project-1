const baseUrl = "https://crudcrud.com/api/b917f28ef69140baac224442c76358bf";

const voteBtn = document.getElementById('submit-button');
voteBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const userName = document.getElementById('name').value;
    const userVote = document.getElementById('candidate').value;

    const voteObj = { 
        name: userName, 
        vote: userVote 
    };

    postData(voteObj);  

    const form = document.getElementById('votingForm');
    form.reset();
});

async function postData (obj) {
    try {
        const result = await axios.post(`${baseUrl}/votingData`, obj);
        let uniqueId = result.data._id;
        displayUserVote(obj, uniqueId);
        updateVoteCounts(obj.vote);
    } catch (err) {
        console.log('Error:', err);
    }
};

function displayUserVote(obj, id){
    const listName = `display${obj.vote}List`;
    const listUserName = obj.name;

    const parentElm = document.getElementById(listName);

    const displayUserVoteName = document.createElement('span');
    displayUserVoteName.textContent = listUserName;

    const childElm = document.createElement('div');
    const btnContainer = document.createElement('span');

    childElm.id = id;

    const deleteVoteBtn = document.createElement('button');
    deleteVoteBtn.textContent = "DELETE";
    deleteVoteBtn.addEventListener('click', (event) => {
        deleteUserVote(event, obj.vote);
    });

    btnContainer.appendChild(displayUserVoteName);
    btnContainer.appendChild(deleteVoteBtn);

    childElm.appendChild(btnContainer);
    parentElm.appendChild(childElm);
};

async function deleteUserVote (event, vote){
    const targetItem = event.target.parentNode.parentNode;
    const userId = targetItem.id;

    try {
        await axios.delete(`${baseUrl}/votingData/${userId}`);
        updateVoteCounts(vote, false);
        const parentElm = targetItem.parentElement;
        parentElm.removeChild(targetItem);
    } catch (err) {
        console.log(err);
    }
};

function updateVoteCounts(candidate, increment = true) {
    const totalVotes = document.getElementById('totalVotes');
    totalVotes.textContent = parseInt(totalVotes.textContent) + (increment ? 1 : -1);

    const candidateVotes = document.getElementById(`vote${candidate}`);
    candidateVotes.textContent = parseInt(candidateVotes.textContent) + (increment ? 1 : -1);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get(`${baseUrl}/votingData`);
        const items = response.data;
        items.forEach(item => {
            displayUserVote(item, item._id);
            updateVoteCounts(item.vote);
        });
    } catch (err) {
        console.log(err);
    }
});
