const userName = document.getElementById('name');
const userRating = document.getElementById('rating');

function onSubmit(event) {
    event.preventDefault();

    const displayName = userName.value;
    const displayRating = userRating.value;

    const info = displayName + ' ' + displayRating + '  ';
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

    userName.value = '';
    userRating.value = '1';
}


function onEdit(button) {
    
    const paragraph = button.parentNode;
    const textNode = paragraph.childNodes[0];
  
    const text = textNode.textContent;
    const [name, rating] = text.split(' ');
  
    userName.value = name;
    userRating.value = rating;

    paragraph.remove();
  }

  function onDelete(button) {
    const paragraph = button.parentNode;
    const textNode = paragraph.childNodes[0];
  
    const text = textNode.textContent;
    const [name, rating] = text.split(' ');

    const correspondingSpan = document.getElementById(`rating${rating}`);
    const currentValue = parseInt(correspondingSpan.textContent);
    correspondingSpan.textContent = currentValue - 1;

    paragraph.remove();
}