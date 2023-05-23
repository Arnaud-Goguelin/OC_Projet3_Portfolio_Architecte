import { works, categories, token, createWorks } from "./home.js"
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
    modalPreviousButton.addEventListener("click", closeAddWorkModal);
    
    /* Dans le formulaire, affichage dynamique de la liste de choix des catégories en fonction des catégories enregistrées dans l'API
    * Pour la première valeur de categories ("Tous"), on n'affiche pas de texte pour la balise <option> et sa valeur est égale à null (pour permettre la modification du bouton valider)
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
    addPhotoButton.addEventListener("change", findNewImage);

    // Activation du bouton "valider" une fois que tous les champs sont remplis
    const requiredElements = document.querySelectorAll(":required");
    requiredElements.forEach(requiredElement => requiredElement.addEventListener("change", checkEntries));

    const validateButton = document.querySelector("#modal__addWork__validate");
    validateButton.addEventListener("click", lastCheck);
}

//Fonction pour revenir à la première modale "Gallerie Photo" (efface l'intégralité de la modale et l'affiche à nouveau)
function closeAddWorkModal() {
    document.querySelector(".modal__background").remove();
    openModal();
}

/* Fonction createNewCategory permet la saisie d'une nouvelle catégorie dans la liste déroulante de choix.
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

//Traitement du fichier téléchargé dans la balise input pour l'ajout d'une nouvelle photo pour un nouveau work
function findNewImage() {
    //Récupération du fichier téléchargé
    const inputImage = document.querySelector("#modal__addWork_addPhotoInput");

    // Vérification du format et de la taille de l'image
    if (inputImage.files[0].type !== "image/jpeg" && inputImage.files[0].type !== "image/png") {
        displayErrorMessage(`Format du fichier incorrect.<br><br>Format requis : <span style = "font-style: italic;">.jpeg</span> ou <span style = "font-style: italic;">.png</span>.`);
        closeErrorMessage();
        inputImage.value = "";
        return;
    }

    // Rappel : 4 Mo = 4194304 o
    if (inputImage.files[0].size > 4194304) {
        displayErrorMessage(`Taille du fichier trop importante.<br><br>Taille maximale autorisée : 4 Mo.`);
        closeErrorMessage();
        inputImage.value = "";
        return;
    }

    //Aperçu de l'image téléchargée
    const imagePreview = document.createElement("img");
        imagePreview.src = window.URL.createObjectURL(inputImage.files[0]);
        imagePreview.style.margin = "0";
        imagePreview.style.width = "35%";
        imagePreview.dataset.id = "newWorkPreview";

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

function checkEntries() {
    //Récupération des 3 balises input et selec du formulaire
    const inputImage = document.querySelector("#modal__addWork_addPhotoInput");
    const newWorkTitle = document.querySelector("#modal__addWork_newWorkTitle");
    const newWorkCategory = document.querySelector("#modal__addWork_newWorkCategory");

    //Vérification de leurs valeurs, si elles sont existantes, on dégrise le bouton valider
    if (inputImage.files.length != 0 && newWorkTitle.value && newWorkCategory.value) {
          document.querySelector("#modal__addWork__validate").style.background = "#1D6154";
    }else{
        document.querySelector("#modal__addWork__validate").style.background = "#A7A7A7";
    };
}


//Affichage de messages d'erreurs en cas de données manquantes
function lastCheck() {

    //Récupération des 3 balises input et selec du formulaire
    const inputImage = document.querySelector("#modal__addWork_addPhotoInput");
    const newWorkTitle = document.querySelector("#modal__addWork_newWorkTitle");
    const newWorkCategory = document.querySelector("#modal__addWork_newWorkCategory");

    //Si leurs valeurs sont inexistantes, on affiche un message d'erreur
    inputImage.files.length === 0 ? displayErrorMessage(`Aucun fichier sélectionné.<br><br>Une image est requise pour ajouter un projet.`) : null;

    newWorkTitle.value === "" ? displayErrorMessage(`Aucun titre saisi.<br><br>Un titre est requis pour ajouter un projet.`) : null;

    newWorkCategory.value === "" ? displayErrorMessage(`Aucune catégorie sélectionnée.<br><br>Une catégorie est requise pour ajouter un projet.`) : null;

    // Si des messages d'erreurs sont affichés, on affiche le bouton de fermeture de ces messages
    const errorMessage = document.querySelector(".error_message");
    if (errorMessage) {
    closeErrorMessage();
    }else{
    //Si aucun message n'est affiché, c'est que nous avons toutes les données valides pour poster le nouveau work, on déclenche alors l'envoie à l'API.
    sendNewWork();
    };
}

function displayErrorMessage(ErrorMessage) {

    /*On masque les éléments de la fenêtre de la modal pour afficher le message d'erreur.
    *On ne les supprime pas pour garder les valeurs saisies ou fichier chargé dans le cas où certain(e)s seraient valides.
    */
    const popUp = document.querySelector(".modal__addWork__main");
    popUp.children[0].style.display = "none";
    const errorMessage = document.createElement("p");
    errorMessage.innerHTML = ErrorMessage;
    errorMessage.classList.add("error_message");
    popUp.appendChild(errorMessage);
};

function closeErrorMessage() {

    //Création d'un bouton de fermeture du message d'erreur
    const popUp = document.querySelector(".modal__addWork__main");
    const marker = document.querySelector(".modal__addWork_marker");
    const closeErrorMessage = document.createElement("button");
    closeErrorMessage.textContent="Fermer";

    //On l'affiche avant la balise hr (assure une place après l'ensemble des messages d'erreur s'il y en a plusieurs)
    popUp.parentElement.insertBefore(closeErrorMessage, marker);
    
    //Au clic, le bouton surpprime du DOM chaque message d'erreur existant + le bouton lui-même et réaffiche les éléments de la modal du formulaire.
    const errorMessages = document.querySelectorAll(".error_message")
        closeErrorMessage.addEventListener("click", () => {
        errorMessages.forEach (errorMessage => errorMessage.remove());
        closeErrorMessage.remove();
        popUp.children[0].style.display = null;
    });
};

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