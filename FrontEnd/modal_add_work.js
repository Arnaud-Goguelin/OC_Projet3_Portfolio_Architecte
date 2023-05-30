import { works, categories, token, createWorks } from "./home.js"
import { openModal } from "./modal_open_close.js"

//Ces 3 variables serviront de conditions pour s'assurer que le formulaire est rempli
let newWorkImageOk = false;
let newWorkTitleOk = false;
let newWorkCategoryOk = false;
let errorMessage;

//Ouverture de la deuxième modale d'ajout des works
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
    modalPreviousButton.style.visibility = "visible";
    modalPreviousButton.addEventListener("click", closeAddWorkModal);
    
    /* Dans le formulaire, affichage dynamique de la liste de choix des catégories en fonction des catégories enregistrées dans l'API
    * Pour la première valeur de categories ("Tous"), on n'affiche pas de texte pour la balise <option>.
    */ 
    const formCategory = document.querySelector("#modal__addWork_newWorkCategory");
    for (let category of categories) {
        const option = document.createElement("option");
            option.value = category.id === 0 ? "" : category.id;
            option.text = category.id === 0 ? "" : category.name;

            formCategory.add(option, null);
            formCategory[0].disabled = true;
    }

    //Ajout d'une possibilité de créer une nouvelle catégorie
    const NewCategory = new Option ("Créer une nouvelle catégorie");
    formCategory.add(NewCategory, null);
    
    formCategory.addEventListener("change", createNewCategory);

   
    //Vérification et traitement du document chargé pour l'ajout de la photo
    const addPhotoButton = document.querySelector("#modal__addWork_addPhotoInput");
    // addPhotoButton.addEventListener("input", findNewImage);
    addPhotoButton.addEventListener("change", findNewImage);

    //Si un titre est saisi on déclenche checkEntries et on passe newWorkTitleOk à true et on teste l'activation du bouton "valider"
    const newWorkTitle = document.querySelector("#modal__addWork_newWorkTitle");
    newWorkTitle.addEventListener("change", (event) => {
        if (event.target.value != "") {
            newWorkTitleOk = true;
            checkEntries();
        }
    });

    //Si une catégorie est sélectionnée on déclenche checkEntries et on passe newWorkCategoryOk à true et on teste l'activation du bouton "valider"
    formCategory.addEventListener("change", (event) => {
        if (event.target.value != "") {
            newWorkCategoryOk = true;
            checkEntries();
        }
    });

    const validateButton = document.querySelector("#modal__addWork__validate")
    validateButton.addEventListener("click", sendNewWork);

    //Gestion de l'affichage des messages d'erreur
    const displayErrorMessageZone = document.querySelector(".modal__addwork__display_errorMessage")
    // choix des events "mousenter" et "mouseleave" plutôt que "mouseover" et "mouseout" pour la compatibilité avec chrome et firefox.
    displayErrorMessageZone.addEventListener("mouseenter", noValueErrorMessage);
    displayErrorMessageZone.addEventListener("mouseleave", hideErrorMessage);
}

//Fermeture de la modale d'ajout d'un work et retour à la première modale "Gallerie Photo" 
//(efface l'intégralité de la modale et l'affiche à nouveau avec réinitialisation des variables de vérifications des données des formulaires)
function closeAddWorkModal() {
    newWorkImageOk = false;
    newWorkTitleOk = false;
    newWorkCategoryOk = false;
    document.querySelector(".modal__background").remove();
    openModal();
}

/* Saisie d'une nouvelle catégorie dans la liste déroulante de choix.
* Elle ne sera pas plus développée car cela ne fait pas partie du cahier des charges 
* (pas d'enregistrement de la valeur saisie et donc pas de prise en compte pour l'activation du bouton valider).
*/

function createNewCategory() {
    const modalTextNewWork = document.querySelector(".modal__addWork__text_container");
    const newWorkCategory = document.querySelector("#modal__addWork_newWorkCategory");
    /* Si l'index de l'élément de la liste choisi est égale à l'index du dernier élément (dernière option ajoutée "Créer une nouvelle catégorie"), 
    * alors afficher un champ de saisi pour saisir le nom de la nouvelle catégorie.
    */
    if (newWorkCategory.selectedIndex === newWorkCategory.length -1) {
        const newCategoryInput = document.createElement("input");
            newCategoryInput.dataset.type = "text";
            newCategoryInput.dataset.name = "newCategoryInput";
            newCategoryInput.dataset.id = "newCategoryInput";

            newWorkCategory.style.display = "none";
            modalTextNewWork.appendChild(newCategoryInput);
            newCategoryInput.focus();
    };
}

//Vérification et traitement du fichier téléchargé dans la balise input pour l'ajout d'une nouvelle photo pour un nouveau work
function findNewImage() {

    const inputImage = document.querySelector("#modal__addWork_addPhotoInput");

    // Vérification du format et de la taille de l'image
    if (inputImage.files[0].type !== "image/jpeg" && inputImage.files[0].type !== "image/png") {
        //Suppression d'éventuel message d'erreur précédent
        hideErrorMessage();
        //Affichage message d'erreur
        const ErrorMessageZone = document.querySelector(".modal__addWork__image_container");
        createErrorMessage("Format du fichier incorrect. Format requis: image.jpeg ou image.png.");
        ErrorMessageZone.appendChild(errorMessage);
        //Réinitialisation
        inputImage.value = "";
        newWorkImageOk = false;
        return;
    }

    // Rappel : 4 Mo = 4194304 o
    if (inputImage.files[0].size > 4194304) {
        //Suppression d'éventuel message d'erreur précédent
        hideErrorMessage();
        //Affichage message d'erreur
        const ErrorMessageZone = document.querySelector(".modal__addWork__image_container");
        createErrorMessage("Taille du fichier trop importante. Taille maximale autorisée : 4 Mo.");
        ErrorMessageZone.appendChild(errorMessage);
        //Réinitialisation
        inputImage.value = "";
        newWorkImageOk = false;
        return;
    }

    hideErrorMessage();

    // On passe newWorkImageOk à true lorsque les 3 vérifications ci dessus sont passées (et que la fonction n'est pas arrêtée par un "return").
    // Puis on teste l'activation du bouton "valider"
    newWorkImageOk = true;
    checkEntries();
    //Aperçu de l'image téléchargée
    const imagePreview = document.createElement("img");
        imagePreview.src = window.URL.createObjectURL(inputImage.files[0]);
        imagePreview.style.margin = "0";
        imagePreview.style.width = "35%";
        imagePreview.dataset.id = "newWorkPreview";

    const imageContainer = document.querySelector(".modal__addWork__image_container");
        imageContainer.style.height = "auto"

    //A la fin du chargement de l'image, on supprime l'URL stockée et on affiche l'image dans son conteneur en masquant les autres éléments (label, input etc etc).
    //On les garde actifs au lieu de remttre à zéro l'innerHTML du conteneur pour un autre usage dans la suite du code.
    imagePreview.onload = () => {
        URL.revokeObjectURL(inputImage.files[0]);
        const imageContainer = document.querySelector(".modal__addWork__image_container");
        Array.from(imageContainer.children).forEach(child => child.style.display = "none");
        imageContainer.appendChild(imagePreview);
        imageContainer.style.padding = "0";
    };
}

//Vérification de la présence des données du formulaire pour activer le bouton de validation
function checkEntries() {
  
    const validateButton = document.querySelector("#modal__addWork__validate");

    //Vérification des 3 variables 
    if (newWorkImageOk === true && newWorkTitleOk === true && newWorkCategoryOk === true) {
          validateButton.disabled = false;
    }else{
        validateButton.disabled = true;
    };
}

// Affichage des messages d'erreur
function noValueErrorMessage() {

    if (newWorkImageOk === false) {
        const ErrorMessageZone = document.querySelector(".modal__addWork__image_container");
        createErrorMessage("Une image est requise pour ajouter une photo.");
        ErrorMessageZone.appendChild(errorMessage);
    };

    if (newWorkTitleOk === false) {
        const ErrorMessageZone = document.querySelector(".modal__addwork__errorMessageTitle");
        createErrorMessage("Un titre est requis pour ajouter une photo.");
        ErrorMessageZone.appendChild(errorMessage);
    };

    if (newWorkCategoryOk === false) {
        const ErrorMessageZone = document.querySelector(".modal__addwork__errorMessageCategory");
        createErrorMessage("Une catégorie est requise pour ajouter une photo.");
        ErrorMessageZone.appendChild(errorMessage);
    };
}

// Création des messages d'erreur
function createErrorMessage(errorMessageText) {

    errorMessage = document.createElement("p");
    errorMessage.innerText = errorMessageText;
    errorMessage.classList.add("error_message_specific");
    return errorMessage;
}

// Suppression des messages d'erreur
function hideErrorMessage() {

    const errorMessages = document.querySelectorAll(".error_message_specific");
    errorMessages ? errorMessages.forEach(errorMessage => errorMessage.remove()) : null;
}

// Envoie des nouvelles données à l'API
async function sendNewWork() {

    //Création du body de la requête fetch sour la forme d'un objet FormData
    const newWorkForm = document.querySelector("#form__newWork");
    const newWorkBody = new FormData(newWorkForm);

    //Envoie du nouveau work
    const answerAPIPostNewWork = await fetch ("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization" : `Bearer ${token}`,
        },
        body: newWorkBody,
    });
    
    //Si la réponse est ok, insertion du nouveau work dans le tableau et MAJ de l'affichage
    if (answerAPIPostNewWork.ok) {
        /*A ce stade la réponse est à parser en objet JS au format JSON. Elle deviendra alors une promesse.
        *Il faut attendre qu'elle soit résolue avant de l'utiliser comme objet à ajouter à notre tableau "works",
        * d'où l'utilisation de la méthode .then.
        */
        answerAPIPostNewWork.json().then(newWork  => {
        works.push(newWork);
        createWorks(works);
        closeAddWorkModal();
        });
    };
};