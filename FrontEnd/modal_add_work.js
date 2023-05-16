/* TO DO:
* OK : prévoir un imput dans la liste de choix des catégories pour en saisir une nouvelle
* OK : sur le bouton + Ajouter photo : aller chercher l'image souhaitée en local,
* OK: la faire apparaitre dans le cadre
*
* changer le bouton valider de inactive à active une fois que tous les champs sont remplis. 
*   Si la class contient "active" donner la possibilité de déclencher la fonction pour poster sur l'API
* 
* regrouper toutes les infos dans un objet (format JSON? très probablement) à poster avec fetch
* poster la nouvelle image et sa catégorie sur l'API, attention : à la bonne adresse!

* Attention, faut'il modifier toutes les valeurs? ex d'un work déjà sur l'API :
    "id": 1,
    "title": "Abajour Tahina",
    "imageUrl": "http://localhost:5678/images/abajour-tahina1651286843956.png",
    "categoryId": 1,
    "userId": 1,
    "category": {
      "id": 1,
      "name": "Objets"

      ou seulement comme l'exemple sur le swagger? :
        "id": 0,
        "title": "string",
        "imageUrl": "string", rien
        "categoryId": "string",
        "userId": 0
* Penser à mettre le token en autorisation
* faire s'afficher la page d'accueil à jour

Pour envoyer des données, il faut utilise l'API form data

*/

import { categories } from "./home.js"
import { openModal } from "./modal_open_close.js"


export function openAddWorkModal() {
    // Effacement de l'intégralité du contenu de la fenêtre de la modale après le modal__header
    const modalGallery = document.querySelector(".modal__gallery__container");
    modalGallery.remove();

    //Récupération et affichage du contenu de la balise template de la seconde modale
    const modalWindow = document.querySelector(".modal__window");
    const cloneModalAddWork = document.querySelector("#modal__window__addWork").content.cloneNode(true);
    modalWindow.appendChild(cloneModalAddWork);

    //Affichage du bouton "précédent" (flèche vers la gauche)
    const modalPreviousButton = document.querySelector(".modal__previous_button");
    modalPreviousButton.style.visibility = null;
    modalPreviousButton.addEventListener("click", closeAddWorkModal)
    
    /* Dans le formulaire, affichage dynamique de la liste de choix des catégories en fonction des catégories enregistrées dans l'API
    * Pour la première valeur de categories ("Tous"), on n'affiche pas de texte pour la balise <option> et sa valeur est égale à null (pour permettre la modification du bouton valider)
    */ 
    const formulaire = document.querySelector("#workCategories");
    for (let category of categories) {
        const option = document.createElement("option");
            option.value = category.id === 0 ? "" : category.id;
            option.text = category.id === 0 ? "" : category.name;

        formulaire.add(option, null);
    }

    //Ajout d'une possibilité de créer une nouvelle catégorie
    const newCategory = document.createElement("option");
    newCategory.innerText = "Créer une nouvelle catégorie";
    formulaire.appendChild(newCategory);
    
    formulaire.addEventListener("change", createNewCategory);
    
    //Traitement du document uploader pour l'ajout de la photo
    const addPhotoButton = document.querySelector("#modal__addWork_addPhotoInput");
    addPhotoButton.addEventListener("change", findNewPhoto);

    //Activation du bouton "valider" une fois que tous les champs sont remplis
    const requiredElements = document.querySelectorAll(":required");
    requiredElements.forEach(requiredElement => requiredElement.addEventListener("change", modifyValidateButton))

}

//Fonction pour revenir à la première modale "Gallerie Photo" (efface l'intégralité de la modale et l'affiche à nouveau)
function closeAddWorkModal() {
    const modalBackground = document.querySelector(".modal__background");
    modalBackground.remove();
    openModal();
}

/* Fonction createNewCategory permet la saisie d'une nouvelle catégorie dans la liste déroulante de choix.
* Elle ne sera pas plus développée car cela ne fait pas partie du cahier des charges (pas d'enregistrement de la valeur saisie).
*/

function createNewCategory() {
    const modalFormNewWork = document.querySelector("#form__newWork");
    const formulaire = document.querySelector("#workCategories")
    /* Si l'index de l'élément de la liste choisi est égale à l'index du dernier élément (dernière option ajoutée "Créer une nouvelle catégorie"), 
    * alors afficher un champ de saisi pour saisir le nom de la nouvelle catégorie.
    */
    if (formulaire.selectedIndex === formulaire.length -1) {
        const newCategoryInput = document.createElement("input");
            newCategoryInput.dataset.type = "text";
            newCategoryInput.dataset.name = "newCategoryInput";
            newCategoryInput.dataset.id = "newCategoryInput";

            formulaire.style.display = "none"
            modalFormNewWork.appendChild(newCategoryInput);
            newCategoryInput.focus();
    }
}

//Traitement du fichier uploadé dans la balise input pour l'ajout d'une nouvelle photo pour un nouveau work
function findNewPhoto() {
    //Récupération du fichier uploadé
    const input = document.querySelector("#modal__addWork_addPhotoInput")
    let image = input.files[0];

    //Deuxième filtre du type de fichier et de la taille maximale accepté malgré l'attribut "accept" dans le code HTML
    if (image.type !== "image/jpeg" && image.type !== "image/png")  {
        alert("mauvais format de fichier");
        image = null;
        return;
    };
    // Rappel : 4 Mo = 4194304 o
    if (image.size > 4194304) {
        alert("fichier trop volumineux");
        image = null;
        return;
    }
    
    
    //Aperçu de la photo uploadée
    const imageURL = window.URL.createObjectURL(image);
    const imagePreview = document.createElement("img");
        imagePreview.src = imageURL;
        imagePreview.style.margin = "0";
        imagePreview.style.width = "35%";

        imagePreview.onload = () => {
            URL.revokeObjectURL(image)
            const previewNewWork = document.querySelector(".addWork_image_container");
            previewNewWork.innerHTML="";
            previewNewWork.appendChild(imagePreview);
                previewNewWork.style.padding = "0";
        };
}

function modifyValidateButton() {
    const validateButton = document.querySelector("#modal__addWork__validate");
    const requiredElements = document.querySelectorAll(":required");

    for (let requiredElement of requiredElements) {
        if (requiredElement.value) {
            console.log(`OK, une valeur existe pour ${requiredElement}`)
            validateButton.classList.replace("modal__addWork__validate_inactive", "modal__addWork__validate_active");
        } else {
            console.log(`Pas de valeur pour ${requiredElement}`)
            validateButton.classList.replace("modal__addWork__validate_active", "modal__addWork__validate_inactive");
            requiredElements[0].value ? null : validateButton.classList.replace("modal__addWork__validate_active", "modal__addWork__validate_inactive");
        }
    };
}


// function checkEntries() {
//     if (imgOk && titleOk && categoryOk) {
//       document.querySelector(".modal-addwork input[type=submit]").disabled = false;
//     } else {
//       document.querySelector(".modal-addwork input[type=submit]").disabled = true;
//     }
//   }
// checkentries