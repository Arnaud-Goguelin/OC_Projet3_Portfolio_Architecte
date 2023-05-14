import { categories } from "./home.js"
import { openModal } from "./modal_open_close.js"


export function openAddWorkModal () {

    const modalGallery = document.querySelector(".modal__gallery__container");
    modalGallery.remove();

    const modalWindow = document.querySelector(".modal__window");
    const cloneModalAddWork = document.querySelector("#modal__window__addWork").content.cloneNode(true);
    modalWindow.appendChild(cloneModalAddWork);

    const modalPreviousButton = document.querySelector(".modal__previous_button");
    modalPreviousButton.style.visibility = null;
    modalPreviousButton.addEventListener("click", closeAddWorkModal)
    
    for (let category of categories) {

        const formulaire = document.querySelector("#newWorkCategory");
        const options = document.createElement("option")
        if (category.id === 0) {category.name = null}; 
        options.innerHTML = category.name;
        formulaire.appendChild(options);

    }
    
}

function closeAddWorkModal () {
    const modalBackground = document.querySelector(".modal__background");
    modalBackground.remove();
    openModal();
}