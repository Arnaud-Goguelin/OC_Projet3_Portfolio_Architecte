import { works } from "./home.js";
import { deleteSelectedWork } from "./modal_delete.js";
import { openAddWorkModal, resetFormAddWorkModal } from "./modal_add_work.js";

export function openModal() {
    //Récupération et affichage des structures et contenus HTML dans les balises templates
    const cloneModal = document.querySelector("#modal").content.cloneNode(true);
    document.body.appendChild(cloneModal);

    const cloneModalGallery = document.querySelector("#modal__window__gallery").content.cloneNode(true);
    const modalWindow = document.querySelector(".modal__window");
    modalWindow.appendChild(cloneModalGallery);

    //Affichage dynamique des works dans la gallerie de la modale
    createWorksModal(works);

    //Gestion de la fermeture de la modale
    const modalCloseButton = document.querySelector(".modal__close_button");
    modalCloseButton.addEventListener("click", closeModal);

    const modalBackground = document.querySelector(".modal__background");
    modalBackground.addEventListener("click", closeModal);

    // Contraint les deux addEventListener ci-dessus à .modal__background (arrière plan de la modale) ou à .modal__close_button (bouton en croix)
    modalWindow.addEventListener("click", event => event.stopPropagation());

    //Ouverture de la deuxième fenêtre de la modale pour l'ajout des works
    const modalAddWorkButton = document.querySelector("#modal__gallery__addWork");
    modalAddWorkButton.addEventListener("click", openAddWorkModal);
}

/* Fonction closeModal = au click, supprime la cible du DOM. Quelle que soit la cible du clic, la fonction s'applique à toute la modale 
* (intérêt : ne supprime pas seulement l'élément cliqué, comme le bouton de fermeture...).
*/

function closeModal(target) {
    resetFormAddWorkModal();
    target = document.querySelector(".modal__background");
    target.remove();
}

// Affichage des works dans la modale
export async function createWorksModal(works) {

    const modalGallery = document.querySelector(".modal__gallery__main");
    modalGallery.innerHTML ="";

    for (const work of works) {
            
        const figureElement = document.createElement("figure");
        // Ajout d'une id à la figure pour permettre la suppression d'un work
        figureElement.dataset.id = work.id;
        modalGallery.appendChild(figureElement);

        const imageWork = document.createElement("img");
        imageWork.src = work.imageUrl;
        imageWork.classList.add("modal__gallery__imageWork");
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
        modalDeleteButton.id = work.id;
        figureElement.appendChild(modalDeleteButton);
        
        //Effet d'affichage du bouton expand
        figureElement.addEventListener("mouseover", () => modalExpandButton.style.visibility = null);
        figureElement.addEventListener("mouseout", () => modalExpandButton.style.visibility = "hidden");

        //Ajout d'un eventListener à la création du bouton Delete pour appeler la fonction deleteSelectedWork
        modalDeleteButton.addEventListener("click", deleteSelectedWork);
    };
}



