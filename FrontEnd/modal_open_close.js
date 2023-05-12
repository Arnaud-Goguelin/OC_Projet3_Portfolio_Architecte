import {works} from "./home.js"

export function openModal() {
    const cloneModal = document.querySelector("#modal").content.cloneNode(true);
    document.body.appendChild(cloneModal);
    createWorksModal(works);

    let modalCloseButton = document.querySelector(".modal__close_button");
    modalCloseButton.addEventListener("click", closeModal);

    let modalBackground = document.querySelector(".modal__container");
    modalBackground.addEventListener("click", closeModal);

// Contraint les deux addEventListener ci-dessus à .modal__container (arrière plan de la modale) ou à .modal__close_button (bouton en croix)
    let modalWindow = document.querySelector(".modal__window");
    modalWindow.addEventListener("click", (event)=>{event.stopPropagation()});
}

/* Fonction closeModal = au click, supprime la cible du DOM. Quelle que soit la cible du clic, la fonction s'applique à toute la modale 
* (intérêt : ne supprime pas seulement l'élément cliqué, comme le bouton de fermeture...).
* La fonction est contrainte par le stopPropagation ci-dessus (le clic dans la fenêtre , excepté sur le bouton de fermeture, ne déclenchera rien)
*/

function closeModal(target) {
    target = document.querySelector(".modal__container");
    target.remove();
}

// Affichage des works dans la modale
export async function createWorksModal(works) {

    const contenerGallery = document.querySelector(".modal__window__gallery");
    contenerGallery.innerHTML ="";

    for (const work of works) {
            
        const figureElement = document.createElement("figure");
        contenerGallery.appendChild(figureElement);

        const imageWork = document.createElement("img");
        imageWork.src = work.imageUrl;
        imageWork.classList.add("imageWork");
        figureElement.appendChild(imageWork);

        const modalPublishButton = document.createElement("button");
        modalPublishButton.innerText = "éditer";
        modalPublishButton.classList.add("modal__gallery__publish_button");
        figureElement.appendChild(modalPublishButton);

        const modalExpandButton = document.createElement("img");
        modalExpandButton.src = "assets/icons/expand.png";
        modalExpandButton.classList.add("modal__gallery__expand_button");
        modalExpandButton.style = "visibility: hidden;";
        figureElement.appendChild(modalExpandButton);
        
        const modalDeleteButton = document.createElement("img");
        modalDeleteButton.src = "assets/icons/delete.png";
        modalDeleteButton.classList.add("modal__gallery__delete_button");
        figureElement.appendChild(modalDeleteButton);
        
        //Effet d'affichage du bouton expand: 
        figureElement.addEventListener("mouseover", () => modalExpandButton.style.visibility = null);
        figureElement.addEventListener("mouseout", () => modalExpandButton.style.visibility = "hidden");
    };
}