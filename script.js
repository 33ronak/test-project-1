function onSubmit(event) {
    event.preventDefault();

    const displayName = userName.value;
    const displayRating = userRating.value;

    const isUpdate = userName.dataset.isUpdate === 'true';

    const info = displayName + ' ' + displayRating + '';
    const displayInfo = document.createElement('p');
    const textNode = document.createTextNode(info);

    const editRating = document.createElement('button');
    editRating.setAttribute('value', 'EDIT');
    editRating.setAttribute('onclick', 'onEdit(this)'); 
    editRating.innerHTML = 'EDIT'; 

    const deleteRating = document.createElement('button');
    deleteRating.setAttribute('value', 'DELETE');
    deleteRating.setAttribute('onclick', 'onDelete(this)'); 
    deleteRating.innerHTML = 'DELETE'; 

    displayInfo.appendChild(textNode);
    displayInfo.appendChild(editRating);
    displayInfo.appendChild(deleteRating);

    const feedback = document.getElementById('displayFeedback');
    feedback.appendChild(displayInfo);

    const selectedRating = parseInt(userRating.value);
    const correspondingSpan = document.getElementById(`rating${selectedRating}`);
    const currentValue = parseInt(correspondingSpan.textContent);
    correspondingSpan.textContent = currentValue + 1;

    const ratingData = {
        username: userName.value,
        rating: userRating.value
    };

    let apiUrl = "https://crudcrud.com/api/7f3e47c7a1464983b7f0307ff7cf2acd/rating";

    if (isUpdate) {
        axios
       .put(apiUrl, ratingData)
       .then((res) => console.log(res))
       .catch((err) => console.log(err));
    } else {
        axios
       .post(apiUrl, ratingData)
       .then((res) => console.log(res))
       .catch((err) => console.log(err));
    }

    userName.value = '';
    userRating.value = '1';
    userName.dataset.isUpdate = 'false';
}

function onEdit(button) {
    const paragraph = button.parentNode;
    const textNode = paragraph.childNodes[0];
  
    const text = textNode.textContent;
    const [name, rating] = text.split(' ');
  
    userName.value = name;
    userRating.value = rating;
    userName.dataset.isUpdate = 'true';
}

function onDelete(button) {
    const paragraph = button.parentNode;
    const textNode = paragraph.childNodes[0];
  
    const text = textNode.textContent;
    const [name, rating] = text.split(' ');
  
    const apiUrl = "https://crudcrud.com/api/7f3e47c7a1464983b7f0307ff7cf2acd/rating";
    axios
       .delete(`${apiUrl}/${name}`)
       .then((res) => console.log(res))
       .catch((err) => console.log(err));
  
    paragraph.remove();
}