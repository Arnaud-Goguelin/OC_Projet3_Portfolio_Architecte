/* TO DO:
* OK : prévoir un imput dans la liste de choix des catégories pour en saisir une nouvelle
* OK : sur le bouton + Ajouter photo : aller chercher l'image souhaitée en local,
* OK: la faire apparaitre dans le cadre
*
* OK: changer le bouton valider de disabled à enabled une fois que tous les champs sont remplis. 
*
* regrouper toutes les infos dans un objet à poster avec fetch
* poster la nouvelle image et sa catégorie sur l'API au clic sur le bouton "Valider", attention : à la bonne adresse!

* Cf le swagger pour les infos à fournir :
    image
    string($binary)
	
    title
    string
	
    category
    integer($int64)

* /!\ Penser à mettre le token en autorisation /!\
* faire s'afficher la page d'accueil à jour ou la gallerie de la modale à jour.
* créer une pop up pour les messages d'alertes plutôt que d'utiliser "alerte".
*/

import { categories, token, createWorks } from "./home.js"
import { openModal } from "./modal_open_close.js"

let newWorkImageOk = null;
let newWorkTitleOk = null;
let newWorkCategoryOk = null;

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
    const formCategory = document.querySelector("#newWorkCategory");
    for (let category of categories) {
        const option = document.createElement("option");
            option.value = category.id === 0 ? "" : category.id;
            option.text = category.id === 0 ? "" : category.name;

            formCategory.add(option, null);
    }

    //Ajout d'une possibilité de créer une nouvelle catégorie
    const newCategory = document.createElement("option");
    newCategory.innerText = "Créer une nouvelle catégorie";
    formCategory.appendChild(newCategory);
    
    formCategory.addEventListener("change", createNewCategory);
    
    //Traitement du document uploader pour l'ajout de la photo
    const addPhotoButton = document.querySelector("#modal__addWork_addPhotoInput");
    addPhotoButton.addEventListener("change", findNewImage);

    // Activation du bouton "valider" une fois que tous les champs sont remplis
    const requiredElements = document.querySelectorAll(":required");
    requiredElements.forEach(requiredElement => requiredElement.addEventListener("change", checkEntries));

    const validateButton = document.querySelector("#modal__addWork__validate");
    validateButton.addEventListener("click", sendNewWork);
}

//Fonction pour revenir à la première modale "Gallerie Photo" (efface l'intégralité de la modale et l'affiche à nouveau)
function closeAddWorkModal() {
    const modalBackground = document.querySelector(".modal__background");
    modalBackground.remove();
    openModal();
}

/* Fonction createNewCategory permet la saisie d'une nouvelle catégorie dans la liste déroulante de choix.
* Elle ne sera pas plus développée car cela ne fait pas partie du cahier des charges 
* (pas d'enregistrement de la valeur saisie et donc pas de prise en compte pour l'activation du bouton valider).
*/

function createNewCategory() {
    const modalFormNewWork = document.querySelector(".addWork_text_container");
    const formCategory = document.querySelector("#newWorkCategory");
    /* Si l'index de l'élément de la liste choisi est égale à l'index du dernier élément (dernière option ajoutée "Créer une nouvelle catégorie"), 
    * alors afficher un champ de saisi pour saisir le nom de la nouvelle catégorie.
    */
    if (formCategory.selectedIndex === formCategory.length -1) {
        const newCategoryInput = document.createElement("input");
            newCategoryInput.dataset.type = "text";
            newCategoryInput.dataset.name = "newCategoryInput";
            newCategoryInput.dataset.id = "newCategoryInput";

            formCategory.style.display = "none"
            modalFormNewWork.appendChild(newCategoryInput);
            newCategoryInput.focus();
    };
}

//Traitement du fichier téléchargé dans la balise input pour l'ajout d'une nouvelle photo pour un nouveau work
function findNewImage() {
    //Récupération du fichier téléchargé
    const inputImage = document.querySelector("#modal__addWork_addPhotoInput")
    let image = inputImage.files[0];

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
    };
    
    //Aperçu de l'image téléchargée
    const imageURL = window.URL.createObjectURL(image);
    const imagePreview = document.createElement("img");
        imagePreview.src = imageURL;
        imagePreview.style.margin = "0";
        imagePreview.style.width = "35%";
        imagePreview.dataset.id = "newWorkPreview"

    /* On donne ici une valeur à newWorkImageOk  car si l'on attend le chargement complet de imagePreview,
    * la fonction checkEntries (cf. ci-dessous) s'exécute avant la fin de findNewImage, et si l'image est rentrée en dernier lors de l'ajout d'un work,
    * le bouton "Valider" n'est jamais activé.
    */

    newWorkImageOk = image;

    //A la fin du chargement de l'image, on supprime l'URL stockée et on affiche l'image dans son conteneur en masquant les autres éléments (label, input etc etc).
    //On les garde actifs au lieu de remttre à zéro l'innerHTML pour un autre usage dans la suite du code.
    imagePreview.onload = () => {
        URL.revokeObjectURL(image)
        const imageContainer = document.querySelector(".addWork_image_container");
        Array.from(imageContainer.children).forEach(child => child.style.display = "none");
        imageContainer.appendChild(imagePreview);
        imageContainer.style.padding = "0";
    };
}

function checkEntries() {
    
    newWorkTitleOk = document.querySelector("#newWorkTitle").value;
    newWorkCategoryOk = document.querySelector("#newWorkCategory").value;

    if (newWorkImageOk && newWorkTitleOk && newWorkCategoryOk) {
          document.querySelector("#modal__addWork__validate").disabled = false;
    } else {
          document.querySelector("#modal__addWork__validate").disabled = true;
    };
}

// Envoie des nouvelles données à l'API

async function sendNewWork () {

    //Création du body de la requête fetch sour la forme d'un objet FormData
    const newWorkForm = document.querySelector("#form__newWork");
    const newWorkBody = new FormData(newWorkForm);
    
    //Envoie du nouveau work
    const answerAPIPostNewWork = await fetch ("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization" : `Bearer ${token}`,
            "Content-type" : "multipart/form-data"
        },
        body: newWorkBody,
    });

    console.log(answerAPIPostNewWork);

    //Si la réponse est ok, insertion du nouveau work dans le tableau et MAJ de l'affichage
    if (answerAPIPostNewWork.ok) {
        const newWork = answerAPIPostNewWork.json();
        works.push(newWork);
        createWorks(works);
        closeAddWorkModal;
    }
}