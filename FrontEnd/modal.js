import {works} from "./home.js"

export function openModal() {
    const cloneModal = document.querySelector("#modal").content.cloneNode(true);
    document.body.appendChild(cloneModal);
    createWorksModal(works);

    let modalCloseButton = document.querySelector(".modal__close_button");
    modalCloseButton.addEventListener("click", closeModal);

    let modalBackground = document.querySelector(".modal__container");
    modalBackground.addEventListener("click", closeModal);

// Contraint les deux addEventListener ci-dessus à l'arrière plan de la modale ou au bouton en croix
    let modalWindow = document.querySelector(".modal__window");
    modalWindow.addEventListener("click", (event)=>{event.stopPropagation()});
}

// Fonction closeModal = au click, supprime la cible du DOM. Quelle que soit la cible du clic, la fonction s'applique à toute la modale (intérêt : ne supprime pas seulement l'élément cliqué, comme le bouton de fermeture...).
// La fonction est contrainte par le stopPropagation ci-dessus (le clic dans la fenêtre en dehors du bouton ne déclenchera rien)
export function closeModal(target) {
    target = document.querySelector(".modal__container");
    target.remove();
}

export function createWorksModal(works) {

    const contenerGallery = document.querySelector(".modal__window__gallery");
    contenerGallery.innerHTML ="";

    for (const work in works) {
            
        const figureElement = document.createElement("figure");
        contenerGallery.appendChild(figureElement);

        const imageWork = document.createElement("img");
        imageWork.src = works[work].imageUrl;
        imageWork.classList.add("imageWork")
        figureElement.appendChild(imageWork);

        const modalPublishButton = document.createElement("button");
        modalPublishButton.innerText = "éditer";
        modalPublishButton.id = "modal__gallery__publish_button";
        figureElement.appendChild(modalPublishButton);

        const modalMoveButton = document.createElement("img");
        modalMoveButton.src = "assets/icons/expand.png";
        modalMoveButton.id = "modal__gallery__move_button";
        modalMoveButton.style = "visibility: hidden;";
        figureElement.appendChild(modalMoveButton);
        

        const modalDeleteButton = document.createElement("img");
        modalDeleteButton.src = "assets/icons/delete.png";
        modalDeleteButton.id = "modal__gallery__delete_button";
        figureElement.appendChild(modalDeleteButton);
        
        imageWork.addEventListener("mouseover", () => modalMoveButton.style.visibility = null);
        imageWork.addEventListener("mouseout", () => modalMoveButton.style.visibility = "hidden");
    };
};

