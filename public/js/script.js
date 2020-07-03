document.addEventListener('DOMContentLoaded', function () {
  var singleRecipe = document.querySelectorAll('.collapsible');
  var instancesRecipe = M.Collapsible.init(singleRecipe);

  var modal = document.querySelectorAll('.modal');
  var instancesModal = M.Modal.init(modal);

  const deleteBtnsUI = document.getElementsByClassName('delete-recipe-btn');
  const editBtnsUI = document.getElementsByClassName('edit-recipe-btn');

  Array.from(deleteBtnsUI).forEach((item) => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.id);
      const url = `/delete/${id}`;
      if (window.confirm('Delete Recipe?')) {
        fetch(url, {
          method: 'DELETE',
        })
          .then((data) => data.json)
          .then((res) => {
            console.log(`Deleting Recipe ${res}...`);
            window.location.href = '/';
          })
          .catch((err) => console.log(`Something went wrong... Error: ${err}`));
      }
    });
  });

  Array.from(editBtnsUI).forEach((item) => {
    item.addEventListener('click', () => {
      const recipeID = document.getElementById('edit-form-id');
      const recipeName = document.getElementById('edit-recipe-name');
      const recipeIngredients = document.getElementById(
        'edit-recipe-ingredients'
      );
      const recipeDirections = document.getElementById(
        'edit-recipe-directions'
      );
      recipeID.value = item.dataset.id;
      recipeName.value = item.dataset.name;
      recipeIngredients.value = item.dataset.ingredients;
      recipeDirections.value = item.dataset.directions;
    });
  });
});
